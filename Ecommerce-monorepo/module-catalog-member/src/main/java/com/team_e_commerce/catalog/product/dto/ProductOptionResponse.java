package com.team_e_commerce.catalog.product.dto;

import com.team_e_commerce.catalog.product.domain.ProductOption;
import com.team_e_commerce.catalog.product.domain.ProductStatus;

public record ProductOptionResponse(
        Long optionId,
        String optionName,
        Integer additionalPrice,
        ProductStatus status
) {
    public static ProductOptionResponse from(ProductOption option) {
        return new ProductOptionResponse(
                option.getId(),
                option.getOptionName(),
                option.getAdditionalPrice(),
                option.getStatus()
        );
    }
}