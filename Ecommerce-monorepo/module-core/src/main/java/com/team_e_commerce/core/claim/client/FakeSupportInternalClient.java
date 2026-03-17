package com.team_e_commerce.core.claim.client;

import com.team_e_commerce.core.claim.client.dto.AdminClaimHistoryRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component // ★ 생성자의 세 번째 파라미터를 만족시킵니다.
public class FakeSupportInternalClient implements SupportInternalClient {

    @Override
    public void sendAdminHistory(AdminClaimHistoryRequestDto request) {
        log.info("[Fake] 백오피스 이력 전송 수신 - claimId: {}, action: {}",
                request.claimId(), request.actionType());
    }
}