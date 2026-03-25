package com.team_e_commerce.common.dto;

public record AdminClaimHistoryRequestDto(
        Long adminId,           // 관리자 식별자
        Long claimId,           // 클레임 식별자
        String orderNumber,     // 주문 번호
        String previousStatus,  // 변경 전 상태 (캡처됨)
        String currentStatus,   // 변경 후 상태
        String actionType,      // "APPROVE" or "REJECT"
        String rejectReason     // 거절 사유 (승인 시 null)
) {}