// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/order/dto/OrderCreateRequest.java
package com.team_e_commerce.core.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import java.util.List;

@Getter
public class OrderCreateRequest {

    @Valid
    @NotNull(message = "주문할 상품 목록은 필수입니다.")
    private List<OrderLineItemRequest> orderItems;

    private String ordererName;
    private String ordererPhone;
    private String zipcode;
    private String address;
    private String detailAddress;

    @Getter
    public static class OrderLineItemRequest {
        @NotNull(message = "상품 옵션 ID는 필수입니다.")
        private Long productOptionId;

        @Min(value = 1, message = "주문 수량은 1개 이상이어야 합니다.")
        private Integer quantity;
    }
}