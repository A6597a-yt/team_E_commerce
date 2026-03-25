package com.team_e_commerce.core.claim.client;

import com.team_e_commerce.common.dto.OrderLineItemInternalDto;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class OrderInternalClientDummy implements OrderInternalClient {

    @Override
    public List<OrderLineItemInternalDto> getOrderItems(List<Long> orderLineItemIds) {
        log.info("[Order 더미 호출] 주문 아이템 조회 요청 진입 (요청 ID 목록: {})", orderLineItemIds);

        if (orderLineItemIds == null || orderLineItemIds.isEmpty()) {
            return List.of();
        }

        // 1. 비즈니스 에러 시뮬레이션 (매직 넘버 999L 포함 시 즉시 에러 발생)
        if (orderLineItemIds.contains(999L)) {
            log.error("[Order 더미 호출] 존재하지 않는 주문 ID(999) 감지. ORDER_ITEM_NOT_FOUND 예외 발생!");
            throw new BusinessException(ErrorCode.ORDER_ITEM_NOT_FOUND);
        }

        // 2. 정상 조회 시뮬레이션 (요청받은 개수만큼 정확히 1:1 매칭하여 DTO 생성)
        List<OrderLineItemInternalDto> dummyItems = orderLineItemIds.stream()
                .map(id -> new OrderLineItemInternalDto(
                        id,                             // orderLineItemId
                        1L,                             // memberId (임의의 회원 ID)
                        "테스트 상품 " + id,            // productName
                        10000L,                         // unitPrice
                        1L,                             // cancelableQuantity
                        "PAYMENT_COMPLETED",            // orderStatus
                        "ORD-TEST-1234",                // orderNumber
                        "test_payment_key_xxx",         // paymentKey
                        10000L                          // actualPayAmount
                ))
                .collect(Collectors.toList());

        log.info("[Order 더미 호출] 주문 아이템 {}건 가짜(Dummy) 데이터 조회 완료!", dummyItems.size());

        return dummyItems;
    }
}