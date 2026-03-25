package com.team_e_commerce.core.claim.event;

import java.util.List;
import java.util.Map;

/**
 * 💡 [Outbox Payload DTO]
 * 자동 부분 취소 발생 시 타 모듈(결제/주문) 전송을 위해 EventOutbox에 JSON으로 저장될 데이터
 */
public record AutoCancelProcessEvent(
        Long memberId,
        List<Long> orderLineItemIds,
        Map<String, Long> refundAmountMap,
        String reason
) {}