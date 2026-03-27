package com.team_e_commerce.catalog.api.internal;


public interface ProductInternalApi {
    ProductOptionInfoDto getProductOptionInfo(Long productOptionId);

    // 내부 통신용 DTO
    record ProductOptionInfoDto(
            Long productId,
            String productName,
            String optionName,
            Integer basePrice,
            Integer additionalPrice
    ) {}
}