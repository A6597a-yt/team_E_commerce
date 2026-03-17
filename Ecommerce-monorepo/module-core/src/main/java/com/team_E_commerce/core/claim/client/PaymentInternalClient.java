package com.team_E_commerce.core.claim.client;

public interface PaymentInternalClient {

    void cancelPayment(Long orderLineItemId, Long amount);

}