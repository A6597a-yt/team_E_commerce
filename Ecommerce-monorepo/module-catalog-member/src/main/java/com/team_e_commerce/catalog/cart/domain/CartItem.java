package com.team_e_commerce.catalog.cart.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private Long productId;
    private Long optionId;
    private Integer quantity;

    public void addQuantity(Integer quantity) {
        this.quantity += quantity;
    }
}