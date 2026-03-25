package com.team_e_commerce.core.claim.client;

import com.team_e_commerce.common.dto.OrderLineItemInternalDto;
import java.util.List;

public interface OrderInternalClient {

    // 순수 조회용 API (트랜잭션 밖에서 호출됨)
    List<OrderLineItemInternalDto> getOrderItems(List<Long> orderLineItemIds);

}