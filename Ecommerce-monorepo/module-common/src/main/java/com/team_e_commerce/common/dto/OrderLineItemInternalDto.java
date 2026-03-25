package com.team_e_commerce.common.dto;

public record OrderLineItemInternalDto(
        Long orderLineItemId,
        Long memberId,
        String productName,
        Long unitPrice,
        Long cancelableQuantity,
        String orderStatus,
        String orderNumber,
        String paymentKey,
        Long actualPayAmount
) {}