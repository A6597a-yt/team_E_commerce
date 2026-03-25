package com.team_e_commerce.core.claim.event;

/**
 * 💡 [Outbox Payload DTO]
 * 클레임 철회 시 EventOutbox에 JSON으로 저장될 데이터
 */
public record ClaimWithdrawnEvent(
        Long claimId,
        Long orderLineItemId
) {}