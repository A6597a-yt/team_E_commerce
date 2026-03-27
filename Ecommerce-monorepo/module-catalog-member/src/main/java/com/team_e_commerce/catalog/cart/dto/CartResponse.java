package com.team_e_commerce.catalog.cart.dto;

import com.team_e_commerce.catalog.cart.domain.Cart;
import com.team_e_commerce.catalog.cart.domain.CartItem;
import java.util.List;

public record CartResponse(
        Long memberId,
        List<CartItemResponse> items
) {
    public record CartItemResponse(
            Long productId,
            Long optionId,
            Integer quantity
    ) {}

    public static CartResponse from(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> new CartItemResponse(item.getProductId(), item.getOptionId(), item.getQuantity()))
                .toList();
        return new CartResponse(cart.getMemberId(), itemResponses);
    }
}