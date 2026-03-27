// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/order/domain/OrderStatus.java
package com.team_e_commerce.core.order.domain;

public enum OrderStatus {
    PENDING_PAYMENT, // 결제 대기
    PAID,            // 결제 완료
    CANCELED         // 주문 취소
}