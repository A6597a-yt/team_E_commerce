package com.team_e_commerce.support.notification.listener;


import com.team_e_commerce.common.event.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        log.info("결제 완료 알림 발송 처리 시작. orderId: {}, memberId: {}", event.orderId(), event.memberId());

        try {
            sendEmail(event.memberId(), event.orderId());
        } catch (Exception e) {
            log.error("알림 발송 실패. orderId: {}", event.orderId(), e);
            // 필요 시 실패 상태 DB 기록
        }
    }

    private void sendEmail(Long memberId, Long orderId) {
        // 실제 이메일 발송 로직 (SMTP 등) 대체
        log.info("[Email 발송 완료] memberId: {}, 주문번호: {}", memberId, orderId);
    }
}