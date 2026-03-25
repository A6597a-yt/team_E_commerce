package com.team_e_commerce.core.infrastructure.redis.outbox;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxCleanupScheduler {

    private final EventOutboxRepository eventOutboxRepository;
    private final RedissonClient redissonClient;

    // 💡 매일 새벽 3시 정각에 실행 (cron = "초 분 시 일 월 요일")
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional // 대량 삭제 쿼리를 위한 트랜잭션 보장
    public void cleanupPublishedEvents() {
        // 청소 전용 분산 락 키
        RLock lock = redissonClient.getLock("lock:outbox:cleanup");

        try {
            // 다른 인스턴스가 이미 청소 중이면 즉시 포기
            boolean isLocked = lock.tryLock(0, 5, TimeUnit.MINUTES);
            if (!isLocked) {
                log.debug("다른 인스턴스에서 아웃박스 청소를 실행 중이므로 스킵합니다.");
                return;
            }

            // 💡 기준 시간: 현재 시간으로부터 7일(1주일) 전
            LocalDateTime threshold = LocalDateTime.now().minusDays(7);

            // 대량 삭제 실행 및 삭제된 건수 반환
            long deletedCount = eventOutboxRepository.deleteByPublishedTrueAndCreatedAtBefore(threshold);

            if (deletedCount > 0) {
                log.info("아웃박스 청소 완료 - {}일 이전의 발행 완료 이벤트 {}건 삭제됨", 7, deletedCount);
            } else {
                log.info("아웃박스 청소 완료 - 삭제할 대상 이벤트가 없습니다.");
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("청소 스케줄러 락 획득 중 인터럽트 발생", e);
        } finally {
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}