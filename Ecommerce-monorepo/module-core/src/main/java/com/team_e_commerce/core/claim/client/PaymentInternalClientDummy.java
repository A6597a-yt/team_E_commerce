package com.team_e_commerce.core.claim.client;

import com.team_e_commerce.common.exception.BusinessException; // 실제 예외 경로에 맞게 수정 필요
import com.team_e_commerce.common.exception.ErrorCode;         // 실제 예외 경로에 맞게 수정 필요
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PaymentInternalClientDummy implements PaymentInternalClient {

    @Override
    public void cancelPayment(Long orderLineItemId, Long amount) {
        log.info("[Payment 더미 호출] 결제 취소 요청 진입 (orderLineItemId: {}, amount: {})", orderLineItemId, amount);

        // 1. 타임아웃 및 장애 시뮬레이션 (9999원일 때 3초 지연 후 에러)
        if (amount != null && amount == 9999L) {
            log.warn("[Payment 더미 호출] 타임아웃 시뮬레이션 동작 (3초 지연 시작...)");
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                log.error("[Payment 더미 호출] 스레드 지연 중 인터럽트 발생", e);
                Thread.currentThread().interrupt(); // 인터럽트 상태 복구
            }
            log.error("[Payment 더미 호출] 타임아웃 시뮬레이션 완료. MANUAL_CHECK_REQUIRED 예외 발생!");
            throw new BusinessException(ErrorCode.MANUAL_CHECK_REQUIRED);
        }

        // 2. 비즈니스 에러 시뮬레이션 (0원 이하일 때 즉시 에러)
        if (amount == null || amount <= 0) {
            log.error("[Payment 더미 호출] 유효하지 않은 금액. INVALID_CLAIM_STATUS 예외 발생!");
            throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
        }

        // 3. 정상 통과 시뮬레이션 (그 외의 일반적인 금액)
        log.info("[Payment 더미 호출] 결제 취소 완료! (orderLineItemId: {}, amount: {})", orderLineItemId, amount);
    }
}