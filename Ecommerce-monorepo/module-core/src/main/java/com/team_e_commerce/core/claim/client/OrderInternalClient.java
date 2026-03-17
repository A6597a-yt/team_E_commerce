package com.team_e_commerce.core.claim.client;

import com.team_e_commerce.core.claim.client.dto.OrderLineItemInternalDto;
import java.util.List;

public interface OrderInternalClient {
    List<OrderLineItemInternalDto> getOrderItems(List<Long> orderLineItemIds);
}