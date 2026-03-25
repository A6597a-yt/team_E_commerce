package com.team_e_commerce.core.claim.service;

public interface ClaimMessagePublisher {
    void publish(String eventType, String payload);
}