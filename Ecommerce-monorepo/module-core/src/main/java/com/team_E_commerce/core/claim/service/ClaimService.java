package com.team_E_commerce.core.claim.service;

import com.team_E_commerce.common.exception.BusinessException;
import com.team_E_commerce.common.exception.ErrorCode;
import com.team_E_commerce.core.claim.client.OrderInternalClient;
import com.team_E_commerce.core.claim.client.dto.OrderLineItemInternalDto;
import com.team_E_commerce.core.claim.domain.Claim;
import com.team_E_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_E_commerce.core.claim.dto.ClaimResponse;
import com.team_E_commerce.core.claim.dto.ClaimSearchCondition;
import com.team_E_commerce.core.claim.event.ClaimWithdrawnEvent;
import com.team_E_commerce.core.claim.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
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
    private final OrderInternalClient orderInternalClient;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public List<ClaimResponse> createClaims(Long memberId, ClaimCreateRequest request) {
        // 리스트에 모아서 한 번에 저장합니다.
        List<Claim> claimsToSave = new ArrayList<>();

        // 환불 계좌 정보 매핑
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

        // 1. 주문 데이터를 단 한 번의 요청으로 가져와 Map으로 변환
        Map<Long, OrderLineItemInternalDto> orderItemMap = orderInternalClient.getOrderItems(requestedItemIds)
                .stream()
                .collect(Collectors.toMap(OrderLineItemInternalDto::orderLineItemId, item -> item));

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
                log.error("존재하지 않는 주문 상세 ID 클레임 요청 - memberId: {}, itemId: {}", memberId, itemId);
                throw new BusinessException(ErrorCode.ORDER_ITEM_NOT_FOUND);
            }

            if (!orderItem.memberId().equals(memberId)) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }

            if (orderItem.cancelableQuantity() < reqItem.quantity()) {
                throw new BusinessException(ErrorCode.EXCEED_CANCELABLE_QUANTITY);
            }

            Claim claim = Claim.builder()
                    .orderLineItemId(itemId)
                    .memberId(memberId)
                    .productName(orderItem.productName())
                    .claimType(Claim.ClaimType.valueOf(request.claimType()))
                    .reason(request.reason())
                    .claimAmount((long) (orderItem.unitPrice() * reqItem.quantity()))
                    .claimQuantity(Long.valueOf(reqItem.quantity()))
                    .imageUrls(request.imageUrls())
                    .refundAccount(refundAccount)
                    .orderNumber(orderItem.orderNumber())
                    .build();

            claimsToSave.add(claim);
        }

        List<Claim> savedClaims = claimRepository.saveAll(claimsToSave);

        return savedClaims.stream()
                .map(ClaimResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<ClaimResponse> getClaimHistory(Long memberId, ClaimSearchCondition condition, Pageable pageable) {
        Page<Claim> claims = claimRepository.searchClaims(memberId, condition, pageable);
        return claims.map(ClaimResponse::from);
    }

    @Transactional
    public void withdrawClaim(Long memberId, Long claimId) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        if (!claim.getMemberId().equals(memberId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        claim.withdraw();

        eventPublisher.publishEvent(new ClaimWithdrawnEvent(
                claim.getId(),
                claim.getOrderLineItemId(),
                claim.getMemberId()
        ));

        log.info("고객 클레임 철회 트랜잭션 정상 종료 - claimId: {}", claimId);
    }
}