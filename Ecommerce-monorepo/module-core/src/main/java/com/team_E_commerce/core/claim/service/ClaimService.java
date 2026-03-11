package com.team_E_commerce.core.claim.service;

import com.team_E_commerce.common.exception.BusinessException;
import com.team_E_commerce.common.exception.ErrorCode;
import com.team_E_commerce.core.claim.client.OrderInternalClient;
import com.team_E_commerce.core.claim.client.dto.OrderLineItemInternalDto;
import com.team_E_commerce.core.claim.domain.Claim;
import com.team_E_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_E_commerce.core.claim.dto.ClaimResponse;
import com.team_E_commerce.core.claim.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final OrderInternalClient orderInternalClient;
    // private final MessagePublisher messagePublisher; // 추후 MQ 확장을 고려한 이벤트 발행기

    public List<ClaimResponse> createClaims(Long memberId, ClaimCreateRequest request) {

        // 1. 요청된 주문 상세 ID 추출
        List<Long> itemIds = request.claimItems().stream()
                .map(ClaimCreateRequest.ClaimItemDto::orderLineItemId)
                .toList();

        // 2. 외부 도메인(주문)에 데이터 요청 (내부 통신 DTO로 안전하게 수신)
        List<OrderLineItemInternalDto> orderItems = orderInternalClient.getOrderItems(itemIds);

        // 3. ID를 키로 하는 Map 생성
        Map<Long, OrderLineItemInternalDto> itemMap = orderItems.stream()
                .collect(Collectors.toMap(OrderLineItemInternalDto::orderLineItemId, item -> item));

        // 4. 비즈니스 룰 3중 검증 및 엔티티 생성
        List<Claim> claims = request.claimItems().stream().map(reqItem -> {
            OrderLineItemInternalDto orderItem = itemMap.get(reqItem.orderLineItemId());

            // 존재하지 않는 상품 ID 검증
            if (orderItem == null) {
                throw new BusinessException(ErrorCode.ORDER_ITEM_NOT_FOUND);
            }

            // 소유권 검증 (해킹 차단) - DTO에 담긴 memberId 활용
            if (!orderItem.memberId().equals(memberId)) {
                log.error("권한 없는 클레임 시도 - memberId: {}, itemId: {}", memberId, reqItem.orderLineItemId());
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }

            // 수량 검증 (이중 환불 차단) - DTO에 담긴 잔여 수량 활용
            if (reqItem.quantity() > orderItem.cancelableQuantity()) {
                throw new BusinessException(ErrorCode.EXCEED_CANCELABLE_QUANTITY);
            }

            // 서버가 직접 환불 금액 계산 (단가 * 요청 수량)
            int refundAmount = orderItem.unitPrice() * reqItem.quantity();

            // 환불 계좌 객체 조립 (null 허용)
            Claim.RefundAccount refundAccount = null;
            if (request.refundAccount() != null) {
                refundAccount = Claim.RefundAccount.builder()
                        .bankName(request.refundAccount().bankName())
                        .accountNumber(request.refundAccount().accountNumber())
                        .accountHolder(request.refundAccount().accountHolder())
                        .build();
            }

            return Claim.builder()
                    .orderLineItemId(reqItem.orderLineItemId())
                    .memberId(memberId)
                    .claimType(Claim.ClaimType.valueOf(request.claimType()))
                    .reason(request.reason())
                    .claimAmount(refundAmount)
                    .claimQuantity(reqItem.quantity())
                    .imageUrls(request.imageUrls())
                    .refundAccount(refundAccount)
                    .build();
        }).toList();

        // 5. DB 일괄 저장
        List<Claim> savedClaims = claimRepository.saveAll(claims);

        // 6. 상태 변경 및 재고 롤백을 위한 이벤트 비동기 발행
        // messagePublisher.publishClaimCreatedEvent(savedClaims);

        // 7. 계좌 마스킹 처리 후 DTO 반환
        return savedClaims.stream()
                .map(ClaimResponse::from)
                .toList();
    }
}