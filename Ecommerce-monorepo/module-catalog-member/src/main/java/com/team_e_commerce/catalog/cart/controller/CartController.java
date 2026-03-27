package com.team_e_commerce.catalog.cart.controller;

import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.catalog.cart.dto.CartAddRequest;
import com.team_e_commerce.catalog.cart.dto.CartResponse;
import com.team_e_commerce.catalog.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart(@AuthenticationPrincipal Long memberId) {
        return ApiResponse.ok(cartService.getCart(memberId));
    }

    @PostMapping
    public ApiResponse<Void> addCartItem(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody CartAddRequest request) {
        cartService.addCartItem(memberId, request);
        return ApiResponse.ok();
    }

    @DeleteMapping("/items")
    public ApiResponse<Void> removeCartItem(
            @AuthenticationPrincipal Long memberId,
            @RequestParam Long productId,
            @RequestParam(required = false) Long optionId) {
        cartService.removeCartItem(memberId, productId, optionId);
        return ApiResponse.ok();
    }

    @DeleteMapping
    public ApiResponse<Void> clearCart(@AuthenticationPrincipal Long memberId) {
        cartService.clearCart(memberId);
        return ApiResponse.ok();
    }
}