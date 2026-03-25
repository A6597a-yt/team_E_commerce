package com.team_e_commerce.core.payment.dto;

import com.team_e_commerce.core.payment.entity.Payment;
import com.team_e_commerce.core.payment.entity.PaymentStatus;

import java.time.LocalDateTime;

public record PaymentResponse(
        Long paymentId,
        Long orderId,
        Long amount,
        PaymentStatus status,
        LocalDateTime paidAt
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaidAt()
        );
    }
}