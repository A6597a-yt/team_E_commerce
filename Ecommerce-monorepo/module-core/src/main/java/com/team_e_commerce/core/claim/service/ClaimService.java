package com.team_e_commerce.core.claim.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.common.dto.OrderLineItemInternalDto;
import com.team_e_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_e_commerce.core.claim.dto.ClaimResponse;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import com.team_e_commerce.core.claim.entity.CancelClaim;
import com.team_e_commerce.core.claim.entity.Claim;
import com.team_e_commerce.core.claim.entity.ExchangeClaim;
import com.team_e_commerce.core.claim.entity.ReturnClaim;
import com.team_e_commerce.core.claim.repository.ClaimRepository;
import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutbox;
import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final EventOutboxRepository eventOutboxRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public List<ClaimResponse> createClaimsLocalTx(Long memberId, ClaimCreateRequest request, Map<Long, OrderLineItemInternalDto> orderItemMap) {
        List<Claim> claimsToSave = new ArrayList<>();

        Claim.RefundAccount refundAccount = null;
        if (request.refundAccount() != null) {
            refundAccount = Claim.RefundAccount.builder()
                    .bankName(request.refundAccount().bankName())
                    .accountNumber(request.refundAccount().accountNumber())
                    .accountHolder(request.refundAccount().accountHolder())
                    .build();
        }

        List<Long> requestedItemIds = request.claimItems().stream()
                .map(ClaimCreateRequest.ClaimItem::orderLineItemId)
                .toList();

        List<Long> pendingClaimItemIds = claimRepository.findPendingClaimItemIds(
                requestedItemIds,
                List.of(Claim.ClaimStatus.REQUESTED, Claim.ClaimStatus.PROCESSING)
        );

        for (ClaimCreateRequest.ClaimItem reqItem : request.claimItems()) {
            Long itemId = reqItem.orderLineItemId();

            if (pendingClaimItemIds.contains(itemId)) {
                throw new BusinessException(ErrorCode.ALREADY_CLAIMED);
            }

            OrderLineItemInternalDto orderItem = orderItemMap.get(itemId);
            if (orderItem == null) {
                throw new BusinessException(ErrorCode.ORDER_ITEM_NOT_FOUND);
            }
            if (!orderItem.memberId().equals(memberId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }

            Claim claim = createPolymorphicClaimEntity(request, reqItem, orderItem, memberId, refundAccount);
            claimsToSave.add(claim);
        }

        List<Claim> savedClaims = claimRepository.saveAll(claimsToSave);

        // 💡 엔티티 빌더 구조에 맞춰 수정 (eventType, payload만 세팅)
        List<EventOutbox> outboxes = savedClaims.stream().map(claim -> {
            Map<String, Object> payloadMap = Map.of(
                    "claimId", claim.getId(),
                    "orderLineItemId", claim.getOrderLineItemId()
            );

            return EventOutbox.builder()
                    .eventType("CLAIM_CREATED")
                    .payload(toJson(payloadMap))
                    .build();
        }).toList();

        eventOutboxRepository.saveAll(outboxes);

        return savedClaims.stream()
                .map(ClaimResponse::from)
                .toList();
    }

    @Transactional
    public void processAutoCancelLocalTx(Long memberId, List<OrderLineItemInternalDto> items, String reason) {
        List<Claim> claimsToSave = new ArrayList<>();

        for (OrderLineItemInternalDto item : items) {
            if (!item.memberId().equals(memberId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }

            switch (item.orderStatus()) {
                case "WAITING_DEPOSIT", "PAYMENT_COMPLETED" -> {
                    CancelClaim claim = CancelClaim.builder()
                            .orderLineItemId(item.orderLineItemId())
                            .memberId(memberId)
                            .productName(item.productName())
                            .reason(reason)
                            .claimAmount(item.actualPayAmount() != null ? item.actualPayAmount() : 0L)
                            .claimQuantity(1L)
                            .orderNumber(item.orderNumber())
                            .build();
                    claimsToSave.add(claim);
                }
                case "PREPARING_PRODUCT", "SHIPPING", "DELIVERED" -> throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
                case "CANCELED" -> throw new BusinessException(ErrorCode.ALREADY_CLAIMED);
                default -> throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
            }
        }

        List<Claim> savedClaims = claimRepository.saveAll(claimsToSave);

        Map<String, Long> refundAmountMap = items.stream()
                .filter(i -> "PAYMENT_COMPLETED".equals(i.orderStatus()))
                .filter(i -> i.actualPayAmount() != null && i.actualPayAmount() > 0)
                .collect(Collectors.groupingBy(
                        OrderLineItemInternalDto::paymentKey,
                        Collectors.summingLong(OrderLineItemInternalDto::actualPayAmount)
                ));

        List<Long> orderLineItemIds = items.stream().map(OrderLineItemInternalDto::orderLineItemId).toList();
        List<Long> savedClaimIds = savedClaims.stream().map(Claim::getId).toList();

        // 💡 자동 취소 아웃박스 저장 (카멜 케이스 적용)
        Map<String, Object> payloadMap = Map.of(
                "claimIds", savedClaimIds,
                "orderLineItemIds", orderLineItemIds,
                "refundAmountMap", refundAmountMap,
                "reason", reason
        );

        EventOutbox outbox = EventOutbox.builder()
                .eventType("CLAIM_AUTO_CANCELED")
                .payload(toJson(payloadMap))
                .build();

        eventOutboxRepository.save(outbox);
    }

    @Transactional
    public void withdrawClaim(Long memberId, Long claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        if (!claim.getMemberId().equals(memberId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        claim.withdraw();

        // 💡 철회 아웃박스 저장 (엔티티 빌더 호환)
        Map<String, Object> payloadMap = Map.of(
                "claimId", claim.getId(),
                "orderLineItemId", claim.getOrderLineItemId()
        );

        EventOutbox outbox = EventOutbox.builder()
                .eventType("CLAIM_WITHDRAWN")
                .payload(toJson(payloadMap))
                .build();

        eventOutboxRepository.save(outbox);
    }

    @Transactional(readOnly = true)
    public Page<ClaimResponse> getClaimHistory(Long memberId, ClaimSearchCondition condition, Pageable pageable) {
        Page<Claim> claimPage = claimRepository.searchClaims(memberId, condition, pageable);
        return claimPage.map(ClaimResponse::from);
    }

    private Claim createPolymorphicClaimEntity(ClaimCreateRequest request,
                                               ClaimCreateRequest.ClaimItem reqItem,
                                               OrderLineItemInternalDto orderItem,
                                               Long memberId,
                                               Claim.RefundAccount refundAccount) {

        if (("RETURN".equals(request.claimType()) || "EXCHANGE".equals(request.claimType()))
                && (request.returnAddress() == null || request.returnAddress().isBlank())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        return switch (request.claimType()) {
            case "CANCEL" -> CancelClaim.builder()
                    .orderLineItemId(reqItem.orderLineItemId())
                    .memberId(memberId)
                    .productName(orderItem.productName())
                    .reason(request.reason())
                    .claimAmount(orderItem.actualPayAmount())
                    .claimQuantity((long) reqItem.quantity())
                    .imageUrls(request.imageUrls())
                    .paymentMethod(request.paymentMethod())
                    .refundAccount(refundAccount)
                    .orderNumber(orderItem.orderNumber())
                    .build();

            case "RETURN" -> ReturnClaim.builder()
                    .orderLineItemId(reqItem.orderLineItemId())
                    .memberId(memberId)
                    .productName(orderItem.productName())
                    .reason(request.reason())
                    .claimAmount(orderItem.actualPayAmount())
                    .claimQuantity((long) reqItem.quantity())
                    .imageUrls(request.imageUrls())
                    .paymentMethod(request.paymentMethod())
                    .refundAccount(refundAccount)
                    .orderNumber(orderItem.orderNumber())
                    .returnAddress(request.returnAddress())
                    .build();

            case "EXCHANGE" -> ExchangeClaim.builder()
                    .orderLineItemId(reqItem.orderLineItemId())
                    .memberId(memberId)
                    .productName(orderItem.productName())
                    .reason(request.reason())
                    .claimAmount(0L)
                    .claimQuantity((long) reqItem.quantity())
                    .imageUrls(request.imageUrls())
                    .paymentMethod(request.paymentMethod())
                    .refundAccount(refundAccount)
                    .orderNumber(orderItem.orderNumber())
                    .returnAddress(request.returnAddress())
                    .build();

            default -> throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        };
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Outbox payload JSON 변환 실패", e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}