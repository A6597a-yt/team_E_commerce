package com.team_e_commerce.core.claim.client;

public interface PaymentInternalClient {

    void cancelPayment(Long orderLineItemId, Long amount);

}