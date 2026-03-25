package com.team_e_commerce.core.payment.client;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

// 외부 PG사 연동을 위한 인터페이스
public interface PaymentGatewayClient {
    void refund(String paymentKey, Long amount);
}

// 모의 결제 구현체 (추후 TossPgClientImpl 등으로 교체 가능)
@Component
class MockPgClientImpl implements PaymentGatewayClient {

    @Override
    public void refund(String paymentKey, Long amount) {
        // ★ 깐깐한 검증: 환불 금액이 0원 이하일 경우 즉시 실패 처리
        if (amount <= 0) {
            throw new BusinessException(ErrorCode.REFUND_FAILED);
        }

        // 실제 연동 대신 로그로 대체
        System.out.println("[Mock PG] 결제 키(" + paymentKey + ")에 대해 " + amount + "원 환불 승인 완료.");
    }
}