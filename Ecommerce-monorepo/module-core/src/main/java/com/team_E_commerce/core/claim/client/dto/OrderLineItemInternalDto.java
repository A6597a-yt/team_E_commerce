package com.team_E_commerce.core.claim.client.dto;

public record OrderLineItemInternalDto(
        Long orderLineItemId,       // 대상 상품 ID
        Long memberId,              // 소유권 검증을 위한 실제 구매자 ID
        Integer unitPrice,          // 금액 조작 방지를 위한 1개당 결제 단가 (총액 / 수량)
        Integer cancelableQuantity  // 이중 환불 방지를 위한 현재 취소/환불 가능 잔여 수량
) {}