package com.team_E_commerce.core.claim.dto;

import com.team_E_commerce.core.claim.domain.Claim;
import java.time.LocalDateTime;
import java.util.List;

public record ClaimResponse(
        Long claimId,
        Long orderLineItemId,
        String claimType,
        String claimStatus,
        String reason,
        Integer claimAmount,
        List<String> imageUrls,
        RefundAccountResponse refundAccount, // 마스킹이 완료된 안전한 계좌 객체
        LocalDateTime createdAt
) {
    // 1. 엔티티를 받아서 DTO로 변환
    public static ClaimResponse from(Claim claim) {
        return new ClaimResponse(
                claim.getId(),
                claim.getOrderLineItemId(),
                claim.getClaimType().name(),
                claim.getClaimStatus().name(),
                claim.getReason(),
                claim.getClaimAmount(),
                claim.getImageUrls(),
                RefundAccountResponse.from(claim.getRefundAccount()), // 여기서 마스킹 처리 위임
                claim.getCreatedAt()
        );
    }

    // 2. 환불 계좌 전용 중첩 Record
    public record RefundAccountResponse(
            String bankName,
            String accountNumber, // 마스킹된 상태로 저장됨
            String accountHolder
    ) {
        public static RefundAccountResponse from(Claim.RefundAccount account) {
            if (account == null) {
                return null; // 카드 결제 등 계좌가 없는 경우 안전하게 null 반환
            }
            return new RefundAccountResponse(
                    account.getBankName(),
                    maskAccountNumber(account.getAccountNumber()), // 마스킹 로직 실행
                    account.getAccountHolder()
            );
        }

        // 3. 마스킹 로직
        private static String maskAccountNumber(String account) {
            if (account == null || account.isBlank()) return account;

            int len = account.length();

            // 극단적으로 짧은 경우 전체 마스킹
            if (len <= 2) {
                return "*".repeat(len);
            }
            // 6자리 이하: 앞 1자리, 뒤 1자리만 노출
            if (len <= 6) {
                return account.substring(0, 1) + "*".repeat(len - 2) + account.substring(len - 1);
            }
            // 7자리 이상: 앞 3자리, 뒤 3자리 노출
            return account.substring(0, 3) + "*".repeat(len - 6) + account.substring(len - 3);
        }
    }
}