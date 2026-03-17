package com.team_E_commerce.core.claim.domain;

import com.team_E_commerce.common.entity.BaseEntity;
import com.team_E_commerce.common.exception.BusinessException;
import com.team_E_commerce.common.exception.ErrorCode;
import com.team_E_commerce.core.claim.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
// ★ 수정 1: 인덱스 컬럼을 물리적 컬럼명(snake_case)으로 명확히 지정
@Table(name = "claims", indexes = {
        @Index(name = "idx_claim_member_id", columnList = "member_id"),
        @Index(name = "idx_claim_created_at", columnList = "created_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Claim extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderLineItemId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String productName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClaimType claimType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClaimStatus claimStatus;

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

    @Embedded
    private RefundAccount refundAccount;

    public enum ClaimType { CANCEL, RETURN, EXCHANGE }
    public enum ClaimStatus { REQUESTED, PROCESSING, COMPLETED, REJECTED, WITHDRAWN }

    @Builder
    public Claim(Long orderLineItemId, Long memberId, String productName, ClaimType claimType,
                 String reason, Long claimAmount, Long claimQuantity,
                 List<String> imageUrls, RefundAccount refundAccount, String orderNumber) {
        this.orderLineItemId = orderLineItemId;
        this.memberId = memberId;
        this.productName = productName;
        this.claimType = claimType;
        this.claimStatus = ClaimStatus.REQUESTED;
        this.reason = reason;
        this.claimAmount = claimAmount;
        this.claimQuantity = claimQuantity;
        this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
        this.refundAccount = refundAccount;
        this.orderNumber = orderNumber;
    }

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
        if (this.claimStatus == ClaimStatus.COMPLETED) {
            return;
        }

        if (this.claimStatus != ClaimStatus.REQUESTED && this.claimStatus != ClaimStatus.PROCESSING) {
            throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
        }

        this.claimStatus = ClaimStatus.COMPLETED;
    }

    public void reject(String rejectReason) {
        if (this.claimStatus == ClaimStatus.REJECTED) {
            return;
        }
        if (this.claimStatus != ClaimStatus.REQUESTED && this.claimStatus != ClaimStatus.PROCESSING) {
            throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
        }
        this.claimStatus = ClaimStatus.REJECTED;
        this.rejectReason = rejectReason;
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