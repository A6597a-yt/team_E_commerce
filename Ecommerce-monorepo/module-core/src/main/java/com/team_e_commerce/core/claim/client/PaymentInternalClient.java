package com.team_e_commerce.core.claim.client;

public interface PaymentInternalClient {

    // 결제 취소 보상 트랜잭션 처리를 위한 동기식 호출 API
    void cancelPayment(Long orderLineItemId, Long amount);

}