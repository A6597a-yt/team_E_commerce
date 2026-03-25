package com.team_e_commerce.core.infrastructure.redis.outbox;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxProcessor {

    private final StringRedisTemplate redisTemplate;
    private final EventOutboxRepository eventOutboxRepository;

    // REQUIRES_NEW: 스케줄러의 트랜잭션과 무관하게 독립적으로 커밋/롤백 보장
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processEvent(Long outboxId) {
        EventOutbox event = eventOutboxRepository.findById(outboxId).orElse(null);

        if (event == null || event.isPublished()) {
            return; // 이미 처리된 경우 방어
        }

        try {
            // 💡 기존 방식 유지: 이벤트 타입별로 Stream Key 생성 및 Map 구조 사용
            redisTemplate.opsForStream().add(
                    "stream:" + event.getEventType(),
                    Map.of("payload", event.getPayload())
            );

            // 전송 성공 시 상태 업데이트 및 에러 메시지 초기화
            event.markAsPublished();

        } catch (Exception e) {
            // 실패 시 DB에 이력 기록
            event.increaseRetryCount();
            event.markAsFailed(e.getMessage());

            log.error("Redis Streams 발행 실패 (재시도 {}/5) - eventId: {}", event.getRetryCount(), event.getId(), e);

            // 💡 신규 방식 반영: 이번 실패로 5회(최대치) 도달 시 Dead Letter 로깅
            if (event.getRetryCount() >= 5) {
                log.error("[CRITICAL] DEAD LETTER 발생: 이벤트 발행 영구 실패. 수동 개입 필요 - eventId: {}", event.getId());
            }
        }
    }
}