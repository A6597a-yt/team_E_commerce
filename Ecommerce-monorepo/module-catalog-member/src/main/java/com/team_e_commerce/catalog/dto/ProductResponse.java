package com.team_e_commerce.catalog.dto;

import com.team_e_commerce.catalog.domain.Product;

public record ProductResponse(
        Long productId,
        String name,
        Integer price,
        String status
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getStatus().name()
        );
    }
}