package com.team_e_commerce.catalog.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartAddRequest(
        @NotNull(message = "상품 ID는 필수입니다.")
        Long productId,

        Long optionId, // 옵션이 없는 상품도 있을 수 있으므로 NotNull 생략 (또는 정책에 따라 추가)

        @NotNull(message = "수량은 필수입니다.")
        @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
        Integer quantity
) {}