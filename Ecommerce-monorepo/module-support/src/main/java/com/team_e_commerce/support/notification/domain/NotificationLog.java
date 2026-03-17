package com.team_e_commerce.support.notification.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationLog extends BaseTimeEntity { // 공통 시간 자동 기록 [cite: 70, 71]

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String eventId;

    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false)
    private Long orderId; // 외부 도메인 참조 (Soft Reference) [cite: 72]

    @Column(nullable = false)
    private String receiverEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    private String failReason; // 실패 시 사유 저장

    @Builder
    public NotificationLog(String eventId, String eventType, Long orderId, String receiverEmail) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.orderId = orderId;
        this.receiverEmail = receiverEmail;
        this.status = NotificationStatus.PENDING; // 초기 상태 [cite: 64]
    }

    public void markAsSuccess() {
        this.status = NotificationStatus.SUCCESS;
    }

    public void markAsFailed(String reason) {
        this.status = NotificationStatus.FAILED;
        this.failReason = reason;
    }
}