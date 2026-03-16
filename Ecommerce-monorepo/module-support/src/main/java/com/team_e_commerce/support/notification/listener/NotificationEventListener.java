package com.team_e_commerce.support.notification.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team_e_commerce.support.notification.dto.OrderNotificationEvent;
import com.team_e_commerce.support.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public void handleMessage(String message) {
        try {
            OrderNotificationEvent event = objectMapper.readValue(message, OrderNotificationEvent.class);
            notificationService.processNotification(event);
        } catch (Exception e) {
            log.error("알림 이벤트 메시지 파싱 또는 처리 실패: {}", message, e);
        }
    }
}