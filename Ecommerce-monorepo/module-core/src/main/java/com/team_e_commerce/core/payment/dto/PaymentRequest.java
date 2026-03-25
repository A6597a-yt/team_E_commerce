package com.team_e_commerce.core.payment.dto;

import com.team_e_commerce.core.payment.entity.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
        @NotNull(message = "주문 ID는 필수입니다.")
        Long orderId,

        @NotNull(message = "회원 ID는 필수입니다.")
        Long memberId,

        @NotNull(message = "결제 금액은 필수입니다.")
        @Min(value = 100, message = "결제 금액은 최소 100원 이상이어야 합니다.")
        Long amount,

        @NotNull(message = "결제 수단은 필수입니다.")
        PaymentMethod paymentMethod
) {
}