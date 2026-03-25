package com.team_e_commerce.core.claim.dto;

import com.team_e_commerce.common.utils.MaskingUtils;
import com.team_e_commerce.core.claim.entity.CancelClaim;
import com.team_e_commerce.core.claim.entity.Claim;
import com.team_e_commerce.core.claim.entity.ExchangeClaim;
import com.team_e_commerce.core.claim.entity.ReturnClaim;
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
        LocalDateTime createdAt,

        // 물류 관련 필드 (CANCEL 타입일 경우 null 반환)
        String returnAddress,
        String returnTrackingNumber,
        String reshipAddress,
        String reshipTrackingNumber
) {
    public static ClaimResponse from(Claim claim) {
        String retAddress = null;
        String retTracking = null;
        String reshipAddr = null;
        String reshipTracking = null;

        if (claim instanceof ReturnClaim rc) {
            retAddress = rc.getReturnAddress();
            retTracking = rc.getReturnTrackingNumber();
        } else if (claim instanceof ExchangeClaim ec) {
            retAddress = ec.getReturnAddress();
            retTracking = ec.getReturnTrackingNumber();
            reshipAddr = ec.getReshipAddress();
            reshipTracking = ec.getReshipTrackingNumber();
        }

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
                .returnAddress(retAddress)
                .returnTrackingNumber(retTracking)
                .reshipAddress(reshipAddr)
                .reshipTrackingNumber(reshipTracking)
                .build();
    }

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