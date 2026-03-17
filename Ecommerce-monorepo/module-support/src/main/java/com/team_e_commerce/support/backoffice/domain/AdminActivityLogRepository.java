package com.team_e_commerce.support.backoffice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Long> {
    // 필요 시 adminId로 이력을 조회하는 페이징 메서드 등을 추가할 수 있습니다.
}