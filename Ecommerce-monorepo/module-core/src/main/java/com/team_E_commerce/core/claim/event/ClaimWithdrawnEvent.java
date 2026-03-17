package com.team_E_commerce.core.claim.event;

public record ClaimWithdrawnEvent(
        Long claimId,
        Long orderLineItemId,
        Long memberId
) {}