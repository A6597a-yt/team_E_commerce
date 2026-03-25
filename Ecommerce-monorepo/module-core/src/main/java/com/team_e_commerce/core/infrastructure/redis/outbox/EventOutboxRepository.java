package com.team_e_commerce.core.infrastructure.redis.outbox;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventOutboxRepository extends JpaRepository<EventOutbox, Long> {

    // 미발행 & 재시도 5회 미만인 이벤트 최대 100건 조회
    List<EventOutbox> findTop100ByPublishedFalseAndRetryCountLessThan(int retryCount);

    // 특정 시점 이전의 발행 완료된 데이터 일괄 삭제
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM EventOutbox e WHERE e.published = true AND e.createdAt < :threshold")
    long deleteByPublishedTrueAndCreatedAtBefore(@Param("threshold") LocalDateTime threshold);

}