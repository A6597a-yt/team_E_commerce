package com.team_e_commerce.core.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentCancelRequest(
        @NotNull(message = "주문 ID는 필수입니다.")
        Long orderId,

        @NotNull(message = "취소 금액은 필수입니다.")
        @Positive(message = "취소 금액은 0보다 커야 합니다.")
        Long cancelAmount
) {
}