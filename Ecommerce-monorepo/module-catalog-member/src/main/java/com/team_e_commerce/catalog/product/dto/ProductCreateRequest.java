// 파일 경로: module-catalog-member/src/main/java/com/team_e_commerce/catalog/dto/ProductCreateRequest.java
package com.team_e_commerce.catalog.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ProductCreateRequest(
        @NotNull(message = "카테고리 ID는 필수입니다.")
        Long categoryId,

        @NotBlank(message = "상품명은 필수입니다.")
        String name,

        @NotNull(message = "가격은 필수입니다.")
        @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
        Integer price,

        String description,

        List<ProductOptionRequest> options
) {
        public record ProductOptionRequest(
                @NotBlank(message = "옵션명은 필수입니다.")
                String optionName,

                @NotNull(message = "추가 금액은 필수입니다. 없으면 0을 입력하세요.")
                @Min(value = 0)
                Integer additionalPrice
        ) {}
}