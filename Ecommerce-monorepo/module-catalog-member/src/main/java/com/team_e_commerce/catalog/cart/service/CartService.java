package com.team_e_commerce.catalog.cart.service;

import com.team_e_commerce.catalog.cart.domain.Cart;
import com.team_e_commerce.catalog.cart.domain.CartItem;
import com.team_e_commerce.catalog.cart.infrastructure.CartRedisRepository;
import com.team_e_commerce.catalog.cart.dto.CartAddRequest;
import com.team_e_commerce.catalog.cart.dto.CartResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRedisRepository cartRepository;

    public CartResponse getCart(Long memberId) {
        Cart cart = cartRepository.findById(memberId)
                .orElse(new Cart(memberId));
        return CartResponse.from(cart);
    }

    public void addCartItem(Long memberId, CartAddRequest request) {
        Cart cart = cartRepository.findById(memberId)
                .orElse(new Cart(memberId));

        cart.addItem(new CartItem(request.productId(), request.optionId(), request.quantity()));
        cartRepository.save(cart);
    }

    public void removeCartItem(Long memberId, Long productId, Long optionId) {
        cartRepository.findById(memberId).ifPresent(cart -> {
            cart.removeItem(productId, optionId);
            cartRepository.save(cart);
        });
    }

    public void clearCart(Long memberId) {
        cartRepository.deleteById(memberId);
    }
}