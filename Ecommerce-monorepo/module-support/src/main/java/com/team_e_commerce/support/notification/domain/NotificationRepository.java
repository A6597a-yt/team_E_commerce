package com.team_e_commerce.support.notification.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationLog, Long> {
    boolean existsByEventId(String eventId); // 멱등성 검증용
}