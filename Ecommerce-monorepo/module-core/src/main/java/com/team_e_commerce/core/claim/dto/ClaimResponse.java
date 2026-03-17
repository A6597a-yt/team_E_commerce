package com.team_e_commerce.core.claim.dto;

import com.team_e_commerce.common.utils.MaskingUtils;
import com.team_e_commerce.core.claim.domain.Claim;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ClaimResponse(
        Long claimId,
        Long orderLineItemId,
        String productName,
        Claim.ClaimType claimType,
        Claim.ClaimStatus claimStatus,
        String reason,

        Long claimAmount,
        Long claimQuantity,

        List<String> imageUrls,
        RefundAccountResponse refundAccount,
        LocalDateTime createdAt
) {
    public static ClaimResponse from(Claim claim) {
        return ClaimResponse.builder()
                .claimId(claim.getId())
                .orderLineItemId(claim.getOrderLineItemId())
                .productName(claim.getProductName())
                .claimType(claim.getClaimType())
                .claimStatus(claim.getClaimStatus())
                .reason(claim.getReason())
                .claimAmount(claim.getClaimAmount())
                .claimQuantity(claim.getClaimQuantity())
                .imageUrls(claim.getImageUrls() != null ? List.copyOf(claim.getImageUrls()) : List.of())
                .refundAccount(RefundAccountResponse.from(claim.getRefundAccount()))
                .createdAt(claim.getCreatedAt())
                .build();
    }

    // 환불 계좌 전용 내부 Record
    public record RefundAccountResponse(
            String bankName,
            String accountNumber,
            String accountHolder
    ) {
        public static RefundAccountResponse from(Claim.RefundAccount account) {
            if (account == null) return null;

            return new RefundAccountResponse(
                    account.getBankName(),
                    MaskingUtils.maskAccountNumber(account.getAccountNumber()),
                    account.getAccountHolder()
            );
        }
    }
}