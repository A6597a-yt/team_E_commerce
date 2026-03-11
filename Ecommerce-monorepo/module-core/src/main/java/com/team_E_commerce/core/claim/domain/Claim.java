package com.team_E_commerce.core.claim.domain;

import com.team_E_commerce.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Claim extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    // 클레임 id
    private Long id;

    // 주문상세 id
    @Column(nullable = false)
    private Long orderLineItemId;

    @Column(nullable = false)
    // 멤버 id
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    // 취소, 교환, 반품
    private ClaimType claimType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    // 진행상태
    private ClaimStatus claimStatus;

    @Column(nullable = false, length = 500)
    // 사유
    private String reason;

    @Column(nullable = false)
    // 수량
    private Integer claimQuantity;

    @Column(nullable = false)
    // 환불,취소 대상 금액 스냅샷
    private Integer claimAmount;

    // 사진 첨부 (문자열 URL 배열 저장)
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "claim_images", joinColumns = @JoinColumn(name = "claim_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    // 환불 계좌 (카드 결제 취소 시 null 허용)
    @Embedded
    private RefundAccount refundAccount;

    @Builder
    public Claim(Long orderLineItemId, Long memberId, ClaimType claimType, String reason, Integer claimQuantity, Integer claimAmount,
                 List<String> imageUrls, RefundAccount refundAccount) {
        this.orderLineItemId = orderLineItemId;
        this.memberId = memberId;
        this.claimType = claimType;
        this.claimStatus = ClaimStatus.REQUESTED; // 최초 생성 시 무조건 '요청됨' 상태
        this.reason = reason;
        this.claimQuantity = claimQuantity;
        this.claimAmount = claimAmount;
        this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
        this.refundAccount = refundAccount;
    }

    // 내부 Enum 및 Embeddable 클래스

    public enum ClaimType { CANCEL, RETURN, EXCHANGE }

    public enum ClaimStatus { REQUESTED, PROCESSING, COMPLETED, REJECTED }

    @Getter
    @Embeddable
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class RefundAccount {
        private String bankName;
        private String accountNumber;
        private String accountHolder;

        @Builder
        public RefundAccount(String bankName, String accountNumber, String accountHolder) {
            this.bankName = bankName;
            this.accountNumber = accountNumber;
            this.accountHolder = accountHolder;
        }
    }
}