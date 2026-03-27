// 파일 경로: module-catalog-member/src/main/java/com/team_e_commerce/catalog/dto/ProductResponse.java
package com.team_e_commerce.catalog.product.dto;


import com.team_e_commerce.catalog.product.domain.Product;
import com.team_e_commerce.catalog.product.domain.ProductStatus;

import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        Long sellerId,
        Long categoryId,
        String name,
        Integer price,
        String description,
        ProductStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String thumbnailUrl,
        List<ProductOptionResponse> options
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSellerId(),
                product.getCategory().getId(),
                product.getName(),
                product.getPrice(),
                product.getDescription(),
                product.getStatus(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getThumbnailUrl(),
                product.getOptions() != null ?
                        product.getOptions().stream()
                                .map(ProductOptionResponse::from)
                                .toList() : java.util.List.of()
        );
    }
}