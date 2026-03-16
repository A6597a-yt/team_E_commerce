package com.team_e_commerce.support.notification.dto;

public record OrderNotificationEvent(
        String eventId,     // 중복 처리 방지용 UUID [cite: 42]
        String eventType,   // ORDER_PAID, ORDER_CANCELED [cite: 42]
        String timestamp,   // ISO-8601 포맷 [cite: 42]
        Payload payload
) {
    public record Payload(
            Long orderId,                     // 외부 도메인 식별자 [cite: 42]
            String receiverEmail,             // 수신자 이메일 [cite: 42]
            String receiverName,              // 수신자 이름 [cite: 42]
            String representativeProductName, // 대표 상품명 [cite: 42]
            Integer totalPaidAmount           // 최종 결제 금액 [cite: 42]
    ) {}
}