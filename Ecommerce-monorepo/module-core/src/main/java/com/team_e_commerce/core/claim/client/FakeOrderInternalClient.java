package com.team_e_commerce.core.claim.client;

import com.team_e_commerce.core.claim.client.dto.OrderLineItemInternalDto;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FakeOrderInternalClient implements OrderInternalClient {

    @Override
    public List<OrderLineItemInternalDto> getOrderItems(List<Long> orderLineItemIds) {
        return orderLineItemIds.stream()
                .map(id -> new OrderLineItemInternalDto(
                        id,                // 1. orderLineItemId (Long)
                        1L,                // 2. memberId (Long)
                        "테스트 상품",       // 3. productName (String)
                        10000L,            // 4. unitPrice (Long)
                        10L,               // 5. cancelableQuantity (Long)
                        "PAID",            // 6. orderStatus (String)
                        "ORD-2026-" + id   // 7. orderNumber (String) ★ 추가된 7번째 인자
                ))
                .collect(Collectors.toList());
    }
}