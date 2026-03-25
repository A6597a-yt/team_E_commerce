package com.team_e_commerce.core.claim.entity;

// 결제 수단 Enum
public enum PaymentMethod {
    CREDIT_CARD, VIRTUAL_ACCOUNT, BANK_TRANSFER, KAKAO_PAY, NAVER_PAY;

    // 환불 계좌 필수 여부 판별
    public boolean requiresRefundAccount() {
        return this == VIRTUAL_ACCOUNT || this == BANK_TRANSFER;
    }
}