package com.team_e_commerce.core.claim.event;

public record ClaimWithdrawnEvent(
        Long claimId,
        Long orderLineItemId,
        Long memberId
) {}