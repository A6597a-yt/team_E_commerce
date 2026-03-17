package com.team_E_commerce.core.claim.event;

import com.team_E_commerce.core.claim.event.ClaimWithdrawnEvent;
import com.team_E_commerce.core.claim.service.ClaimMessagePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimEventListener {

    private final ClaimMessagePublisher messagePublisher;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleClaimWithdrawnEvent(ClaimWithdrawnEvent event) {
        log.info("비동기 이벤트 수신 - 클레임 철회 후속 처리 시작: claimId={}", event.claimId());

        try {
            messagePublisher.publishClaimWithdrawnEvent(event);
            log.info("클레임 철회 메시지 발행 성공 - claimId: {}", event.claimId());

        } catch (Exception e) {
            log.error("클레임 철회 후속 알림 발송 실패 (Dead Letter Queue 적재 등 후속 처리 필요) - claimId: {}", event.claimId(), e);
        }
    }
}