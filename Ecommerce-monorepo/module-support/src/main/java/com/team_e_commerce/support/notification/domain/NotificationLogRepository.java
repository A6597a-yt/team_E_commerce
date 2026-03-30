package com.team_e_commerce.support.notification.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    // 기본 CRUD 및 findAll() 메서드는 JpaRepository가 자동으로 제공합니다.
    // 최신순 정렬이 필요하다면 아래처럼 메서드 이름을 정의해 사용할 수 있습니다.
    // List<NotificationLog> findAllByOrderByCreatedAtDesc();
}