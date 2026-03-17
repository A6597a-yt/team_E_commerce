package com.team_E_commerce.core.infrastructure.redis.publisher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team_E_commerce.core.claim.event.ClaimWithdrawnEvent;
import com.team_E_commerce.core.claim.service.ClaimMessagePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisStreamClaimMessagePublisher implements ClaimMessagePublisher {

    private final StringRedisTemplate redisTemplate; // 공통 인프라의 Redis 통신 도구
    private final ObjectMapper objectMapper;         // 공통 인프라의 JSON 직렬화 도구

    // 타 도메인과 겹치지 않도록 명확한 Stream Key 지정
    private static final String CLAIM_STREAM_KEY = "stream:claim:events";

    @Override
    public void publishClaimWithdrawnEvent(ClaimWithdrawnEvent event) {
        try {
            // 코어 도메인의 이벤트를 범용적인 JSON으로 직렬화
            String jsonPayload = objectMapper.writeValueAsString(event);

            // Redis Stream 구성
            Map<String, String> eventMap = Map.of(
                    "eventType", "CLAIM_WITHDRAWN",
                    "payload", jsonPayload
            );

            // 메시지 영속화 및 발행
            MapRecord<String, String, String> record = StreamRecords.newRecord()
                    .ofMap(eventMap)
                    .withStreamKey(CLAIM_STREAM_KEY);

            redisTemplate.opsForStream().add(record);

            log.info("Redis Stream 메시지 발행 성공 (공통 인프라 계층) - streamKey: {}, claimId: {}",
                    CLAIM_STREAM_KEY, event.claimId());

        } catch (Exception e) {
            log.error("Redis Stream 메시지 발행 실패 - claimId: {}", event.claimId(), e);
            // 에러 로깅 후 런타임 예외 던짐
            throw new RuntimeException("Redis 인프라 통신 중 오류 발생", e);
        }
    }
}