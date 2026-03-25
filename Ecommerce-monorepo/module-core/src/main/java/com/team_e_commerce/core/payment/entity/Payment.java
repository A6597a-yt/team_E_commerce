package com.team_e_commerce.core.payment.entity;

import com.team_e_commerce.common.entity.BaseEntity; // 패키지 경로 확인 필요
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment", uniqueConstraints = {
        @UniqueConstraint(name = "uk_payment_order_id", columnNames = "order_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "fail_reason", length = 500)
    private String failReason;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // 누적 취소 금액 (기본값 0)
    @Column(name = "canceled_amount", nullable = false)
    private Long canceledAmount = 0L;

    // 최근 취소 일시
    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    @Builder
    public Payment(Long orderId, Long memberId, Long amount, PaymentMethod paymentMethod) {
        this.orderId = orderId;
        this.memberId = memberId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = PaymentStatus.READY;
    }

    public void complete() {
        this.status = PaymentStatus.COMPLETED;
        this.paidAt = LocalDateTime.now();
    }

    public void fail(String reason) {
        this.status = PaymentStatus.FAILED;
        this.failReason = reason;
    }

    public void cancel(Long requestCancelAmount) {
        // 1. 상태 검증
        if (this.status != PaymentStatus.COMPLETED && this.status != PaymentStatus.PARTIAL_CANCELED) {
            throw new IllegalStateException("취소할 수 없는 결제 상태입니다.");
        }
        // 2. 금액 검증
        if (this.canceledAmount + requestCancelAmount > this.amount) {
            throw new IllegalArgumentException("취소 요청 금액이 총 결제 금액을 초과합니다.");
        }

        // 3. 취소 정보 업데이트
        this.canceledAmount += requestCancelAmount;
        this.canceledAt = LocalDateTime.now();

        // 4. 상태 변경 (누적 취소 금액이 총액과 같으면 완전 취소, 아니면 부분 취소)
        if (this.canceledAmount.equals(this.amount)) {
            this.status = PaymentStatus.CANCELED;
        } else {
            this.status = PaymentStatus.PARTIAL_CANCELED;
        }
    }
}