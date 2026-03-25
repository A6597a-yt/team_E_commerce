package com.team_e_commerce.core.claim.service;

import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutbox;
import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxRetryService {

    private final EventOutboxRepository outboxRepository;
    private final StringRedisTemplate redisTemplate;

    private static final int MAX_RETRIES = 5;
    private static final String STREAM_KEY = "claim-events";

    // 5분마다 실행하여 누락/실패된 이벤트를 찾아 재발행 시도
    @Transactional
    @Scheduled(fixedDelay = 300000)
    public void retryFailedEvents() {
        List<EventOutbox> failedEvents = outboxRepository.findByPublishedFalseAndRetryCountLessThan(MAX_RETRIES);

        if (failedEvents.isEmpty()) {
            return;
        }

        log.info("재발행 대상 EventOutbox {}건을 찾아 재시도합니다.", failedEvents.size());

        for (EventOutbox outbox : failedEvents) {
            try {
                // 💡 Redis Streams 직접 발행
                Map<String, String> message = Map.of(
                        "eventType", outbox.getEventType(),
                        "payload", outbox.getPayload()
                );
                redisTemplate.opsForStream().add(STREAM_KEY, message);

                outbox.markAsPublished();

            } catch (Exception e) {
                outbox.increaseRetryCount();
                outbox.markAsFailed(e.getMessage());
                log.warn("EventOutbox 재발행 실패 (ID: {}, 누적 재시도: {}/{})", outbox.getId(), outbox.getRetryCount(), MAX_RETRIES);

                // 5회 모두 실패 시 데드레터 큐로 보내거나 Slack 알람 발송 로직 추가 가능
                if (outbox.getRetryCount() >= MAX_RETRIES) {
                    log.error("[CRITICAL] EventOutbox 발행 최종 실패! 수동 확인이 필요합니다. (ID: {})", outbox.getId());
                }
            }
        }
    }
}