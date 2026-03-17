package com.team_e_commerce.common.internal;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class EventEnvelope<T> {

    private final String eventId;
    private final String traceId;
    private final String eventType;
    private final long timestamp;
    private final T payload;

    // 이벤트 생성을 위한 팩토리 메서드
    public static <T> EventEnvelope<T> of(String traceId, String eventType, T payload) {
        return EventEnvelope.<T>builder()
                .eventId(UUID.randomUUID().toString())
                .traceId(traceId)
                .eventType(eventType)
                .timestamp(System.currentTimeMillis())
                .payload(payload)
                .build();
    }
}