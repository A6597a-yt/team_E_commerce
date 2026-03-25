package com.team_e_commerce.core.infrastructure.redis.outbox;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxRelayScheduler {

    private final EventOutboxRepository outboxRepository;
    private final OutboxProcessor outboxProcessor;
    private final RedissonClient redissonClient;

    private static final int MAX_RETRY_COUNT = 5;

    // 💡 신규 방식: 1분 주기로 스케줄링
    @Scheduled(fixedDelay = 10000)
    public void publishOutboxEvents() {
        RLock lock = redissonClient.getLock("lock:outbox:scheduler");

        try {
            // 서버 다중화 환경에서 중복 실행 방지 (락 획득 실패 시 즉시 포기)
            boolean isLocked = lock.tryLock(0, 30, TimeUnit.SECONDS);
            if (!isLocked) {
                log.debug("다른 인스턴스에서 스케줄러를 실행 중이므로 스킵합니다.");
                return;
            }

            // 💡 신규 방식: 5회 미만 실패한 건만 최대 100건 가져옴 (OOM 방지)
            List<EventOutbox> unpublishedEvents = outboxRepository
                    .findTop100ByPublishedFalseAndRetryCountLessThan(MAX_RETRY_COUNT);

            if (unpublishedEvents.isEmpty()) {
                return;
            }

            // 💡 단건 독립 트랜잭션 프로세서로 위임
            for (EventOutbox event : unpublishedEvents) {
                outboxProcessor.processEvent(event.getId());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("스케줄러 락 획득 중 인터럽트 발생", e);
        } finally {
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}