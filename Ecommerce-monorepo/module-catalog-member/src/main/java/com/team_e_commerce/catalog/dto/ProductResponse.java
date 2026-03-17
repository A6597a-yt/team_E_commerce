package com.team_e_commerce.catalog.dto;

import com.team_e_commerce.catalog.domain.Product;

public record ProductResponse(
        Long productId,
        String name,
        Integer price,
        Integer stockQuantity,
        String status
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getStatus().name()
        );
    }
}