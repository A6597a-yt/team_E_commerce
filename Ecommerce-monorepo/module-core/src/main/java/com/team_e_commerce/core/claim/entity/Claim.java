package com.team_e_commerce.core.claim.entity;

import com.team_e_commerce.common.entity.BaseEntity;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.core.claim.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims", indexes = {
        @Index(name = "idx_claim_member_id", columnList = "member_id"),
        @Index(name = "idx_claim_order_number", columnList = "order_number"),
        @Index(name = "idx_claim_order_line_item_id", columnList = "order_line_item_id"),
        @Index(name = "idx_claim_created_at", columnList = "created_at")
})
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "claim_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder // 상속 구조에서의 안전한 빌더 사용을 위해 도입
public abstract class Claim extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(nullable = false)
    private Long orderLineItemId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String productName;

    // DTO 조회 등 기존 로직 호환성을 위해 필드는 남겨두되,
    // DB 입력/수정은 JPA @DiscriminatorColumn이 전담하도록 막아둡니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "claim_type", insertable = false, updatable = false)
    private ClaimType claimType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClaimStatus claimStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(length = 500)
    private String reason;

    private Long claimAmount;
    private Long claimQuantity;

    @Column(name = "order_number", nullable = false)
    private String orderNumber;

    @Column(name = "reject_reason", length = 500)
    private String rejectReason;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> imageUrls = new ArrayList<>();

    // 합의된 대로 환불 계좌는 공통 필드에 유지
    @Embedded
    private RefundAccount refundAccount;

    public enum ClaimType { CANCEL, RETURN, EXCHANGE }
    public enum ClaimStatus { REQUESTED, PROCESSING, COMPLETED, REJECTED, WITHDRAWN, MANUAL_CHECK_REQUIRED }

    @PrePersist
    protected void onPrePersist() {
        if (this.claimStatus == null) {
            this.claimStatus = ClaimStatus.REQUESTED;
        }
        if (this.imageUrls == null) {
            this.imageUrls = new ArrayList<>();
        }
    }

    //  상태 전이 로직
    public void withdraw() {
        if (this.claimStatus != ClaimStatus.REQUESTED) {
            throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
        }
        this.claimStatus = ClaimStatus.WITHDRAWN;
    }

    public void startProcessing() {
        if (this.claimStatus != ClaimStatus.REQUESTED) {
            throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
        }
        this.claimStatus = ClaimStatus.PROCESSING;
    }

    public void complete() {
        if (this.claimStatus == ClaimStatus.COMPLETED) return;
        if (this.claimStatus != ClaimStatus.REQUESTED && this.claimStatus != ClaimStatus.PROCESSING) {
            throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
        }
        this.claimStatus = ClaimStatus.COMPLETED;
    }

    public void reject(String rejectReason) {
        if (this.claimStatus == ClaimStatus.REJECTED) return;
        if (this.claimStatus != ClaimStatus.REQUESTED && this.claimStatus != ClaimStatus.PROCESSING) {
            throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
        }
        this.claimStatus = ClaimStatus.REJECTED;
        this.rejectReason = rejectReason;
    }

    public void markAsManualCheckRequired() {
        this.claimStatus = ClaimStatus.MANUAL_CHECK_REQUIRED;
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @Embeddable
    public static class RefundAccount {
        @Column(name = "refund_bank_name", length = 50)
        private String bankName;

        @Column(name = "refund_account_number", length = 100)
        private String accountNumber;

        @Column(name = "refund_account_holder", length = 50)
        private String accountHolder;

        @Builder
        public RefundAccount(String bankName, String accountNumber, String accountHolder) {
            this.bankName = bankName;
            this.accountNumber = accountNumber;
            this.accountHolder = accountHolder;
        }
    }
}