package com.team_e_commerce.core.claim.client.dto;

public record OrderLineItemInternalDto(
        Long orderLineItemId,
        Long memberId,
        String productName,
        Long unitPrice,
        Long cancelableQuantity,
        String orderStatus,
        String orderNumber
) {}