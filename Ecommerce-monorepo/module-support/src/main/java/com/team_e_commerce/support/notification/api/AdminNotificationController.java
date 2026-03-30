package com.team_e_commerce.support.notification.api;

import com.team_e_commerce.support.notification.domain.NotificationLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/notifications")
public class AdminNotificationController {

    // 본인 프로젝트의 실제 Repository 클래스명으로 변경하세요
    private final NotificationLogRepository notificationLogRepository;

    public AdminNotificationController(NotificationLogRepository notificationLogRepository) {
        this.notificationLogRepository = notificationLogRepository;
    }

    @GetMapping
    public ResponseEntity<?> getNotificationLogs() {
        // DB에서 조회하여 반환 (최신순 정렬 권장)
        return ResponseEntity.ok(notificationLogRepository.findAll());
    }
}