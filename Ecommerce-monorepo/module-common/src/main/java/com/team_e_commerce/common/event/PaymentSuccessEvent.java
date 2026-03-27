package com.team_e_commerce.common.event;

public record PaymentSuccessEvent(
        Long orderId,
        Long memberId
) {}