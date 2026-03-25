package com.team_e_commerce.core.infrastructure.redis.outbox;

import com.team_e_commerce.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_outbox", indexes = {
        // 복합 인덱스
        @Index(name = "idx_outbox_published_created", columnList = "published, created_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EventOutbox extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false)
    private boolean published = false;

    // 재시도 및 추적을 위해 추가된 필드들
    @Column(nullable = false)
    private int retryCount = 0;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private LocalDateTime publishedAt;

    @Builder
    public EventOutbox(String eventType, String payload) {
        this.eventType = eventType;
        this.payload = payload;
    }

    //비즈니스 로직

    public void markAsPublished() {
        this.published = true;
        this.publishedAt = LocalDateTime.now();
        this.errorMessage = null; // 성공했으므로 에러 메시지 초기화
    }

    public void increaseRetryCount() {
        this.retryCount++;
    }

    public void markAsFailed(String errorMessage) {
        // 에러 메시지가 너무 길면 DB 컬럼 사이즈에 맞춰 자릅니다.
        this.errorMessage = errorMessage != null && errorMessage.length() > 500
                ? errorMessage.substring(0, 500) : errorMessage;
    }
}