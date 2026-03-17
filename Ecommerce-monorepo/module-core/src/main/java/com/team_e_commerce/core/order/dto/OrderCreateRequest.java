package com.team_e_commerce.core.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
public class OrderCreateRequest {

    // 결제 관련 정보들

    @Valid
    @NotNull(message = "주문할 상품 목록은 필수입니다.")
    private List<OrderLineItemRequest> orderItems;

    @Getter
    public static class OrderLineItemRequest {
        @NotNull(message = "상품 ID는 필수입니다.")
        private Long productId;

        // 최소수량 요구.
        @Min(value = 1, message = "주문 수량은 1개 이상이어야 합니다.")
        private Integer quantity;
    }
}