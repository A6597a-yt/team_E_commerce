package com.team_e_commerce.common.event;

public record PaymentFailedEvent(
        Long orderId
) {}