package com.team_e_commerce.core.claim.service;

import com.team_e_commerce.core.claim.event.ClaimWithdrawnEvent;

public interface ClaimMessagePublisher {

    void publishClaimWithdrawnEvent(ClaimWithdrawnEvent event);

}