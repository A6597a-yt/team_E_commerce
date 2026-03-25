package com.team_e_commerce.core.claim.event;

import java.util.List;

/**
 * 💡 [Outbox Payload DTO]
 * 클레임 트랜잭션 종료 후 EventOutbox를 통해 재고 모듈 등에 비동기/안전하게 전달될 데이터
 */
public record OrderItemsCanceledEvent(
        List<Long> orderLineItemIds,
        Long memberId,
        String reason
) {}