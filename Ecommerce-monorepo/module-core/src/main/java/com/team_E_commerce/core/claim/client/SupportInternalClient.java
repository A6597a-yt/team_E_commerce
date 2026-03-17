package com.team_E_commerce.core.claim.client;

import com.team_E_commerce.core.claim.client.dto.AdminClaimHistoryRequestDto;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;

public interface SupportInternalClient {

    // 네트워크 지연 시 최대 3번 시도하되, 대기 시간은 최소화 (200ms -> 400ms)
    @Retryable(
            retryFor = {Exception.class}, // 실제 운영에서는 TimeoutException 등으로 구체화 권장
            maxAttempts = 3,
            backoff = @Backoff(delay = 200, multiplier = 2)
    )
    void sendAdminHistory(AdminClaimHistoryRequestDto request);
}