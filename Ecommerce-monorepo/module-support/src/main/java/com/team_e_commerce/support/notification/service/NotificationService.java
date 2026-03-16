package com.team_e_commerce.support.notification.service;

import com.team_e_commerce.support.notification.domain.NotificationLog;
import com.team_e_commerce.support.notification.domain.NotificationRepository;
import com.team_e_commerce.support.notification.dto.OrderNotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void processNotification(OrderNotificationEvent event) {
        // 1. 이벤트 멱등성 보장 (중복 발송 방지)
        if (notificationRepository.existsByEventId(event.eventId())) {
            log.warn("이미 처리된 알림 이벤트입니다. eventId: {}", event.eventId());
            return;
        }

        // 2. 발송 로그 적재 (PENDING)
        NotificationLog notificationLog = NotificationLog.builder()
                .eventId(event.eventId())
                .eventType(event.eventType())
                .orderId(event.payload().orderId())
                .receiverEmail(event.payload().receiverEmail())
                .build();

        notificationRepository.save(notificationLog);

        try {
            // 3. 메일 발송 로직
            sendEmail(event.payload());

            // 4. 성공 상태 업데이트
            notificationLog.markAsSuccess();
        } catch (Exception e) {
            // 5. 실패 상태 업데이트 및 로그
            log.error("알림 발송 실패. orderId: {}", event.payload().orderId(), e);
            notificationLog.markAsFailed(e.getMessage());
        }
    }

    private void sendEmail(OrderNotificationEvent.Payload payload) {
        // TODO: SMTP 서버 연동 또는 외부 이메일 API 호출 구현
        log.info("[Email 발송 완료] 수신자: {}, 주문번호: {}, 결제금액: {}",
                payload.receiverEmail(), payload.orderId(), payload.totalPaidAmount());
    }
}