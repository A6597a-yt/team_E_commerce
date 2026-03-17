package com.team_e_commerce.core.claim.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component // ★ 이 어노테이션이 있어야 'No qualifying bean' 에러가 사라집니다.
public class FakePaymentInternalClient implements PaymentInternalClient {

    @Override
    public void cancelPayment(Long orderLineItemId, Long amount) {
        log.info("[Fake] 결제 취소 요청 수신 - orderLineItemId: {}, amount: {}", orderLineItemId, amount);
    }
}