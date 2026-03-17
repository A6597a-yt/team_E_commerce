package com.team_e_commerce.core.claim.dto;

import com.team_e_commerce.core.claim.domain.Claim.ClaimStatus;
import com.team_e_commerce.core.claim.domain.Claim.ClaimType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ClaimSearchCondition(
        // 1. 기간 조건
        LocalDate startDate,
        LocalDate endDate,

        // 2. 상태 조건
        ClaimType claimType,
        ClaimStatus claimStatus,

        // 3. 식별자 조건
        Long memberId,
        String orderNumber
) {
    public LocalDateTime getStartDateTime() {
        return startDate != null ? startDate.atStartOfDay() : null;
    }

    public LocalDateTime getEndDateTime() {
        return endDate != null ? endDate.atTime(LocalTime.MAX) : null;
    }
}