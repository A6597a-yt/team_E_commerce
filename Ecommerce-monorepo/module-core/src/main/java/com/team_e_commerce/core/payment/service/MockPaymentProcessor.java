package com.team_e_commerce.core.payment.service;

import org.springframework.stereotype.Component;
import java.util.Random;

@Component
public class MockPaymentProcessor {
    private final Random random = new Random();

    public PaymentResult process(Long amount) {
        // 1~10 난수 생성
        int chance = random.nextInt(10) + 1;

        if (chance <= 8) {
            return new PaymentResult(true, null); // 80% 성공
        } else {
            return new PaymentResult(false, "잔액 부족 또는 한도 초과 (Mock 실패)"); // 20% 실패
        }
    }

    public PaymentResult cancelProcess(Long cancelAmount) {
        // 편의상 100% 성공으로 처리
        return new PaymentResult(true, null);
    }

    public record PaymentResult(boolean isSuccess, String failReason) {}
}