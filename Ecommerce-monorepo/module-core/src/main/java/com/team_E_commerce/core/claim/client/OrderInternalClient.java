package com.team_E_commerce.core.claim.client;

import com.team_E_commerce.core.claim.client.dto.OrderLineItemInternalDto;
import java.util.List;

public interface OrderInternalClient {
    List<OrderLineItemInternalDto> getOrderItems(List<Long> orderLineItemIds);
}