package com.team_e_commerce.core.order.service;

import com.team_e_commerce.catalog.api.internal.ProductInternalApi;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.core.inventory.facade.InventoryRetryFacade;
import com.team_e_commerce.core.order.domain.Order;
import com.team_e_commerce.core.order.domain.OrderLineItem;
import com.team_e_commerce.core.order.domain.OrderRepository;
import com.team_e_commerce.core.order.dto.OrderCreateRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryRetryFacade inventoryRetryFacade;
    private final ProductInternalApi productInternalApi;

    @Transactional
    public Long createOrder(Long memberId, OrderCreateRequest request) {

        // 1. 결제 전 재고 확인 및 낙관적 락 차감 (Facade 사용)
        for (OrderCreateRequest.OrderLineItemRequest itemReq : request.getOrderItems()) {
            inventoryRetryFacade.decreaseStockWithRetry(itemReq.getProductOptionId(), (long) itemReq.getQuantity());
        }

        // 2. 카탈로그 모듈에서 상품/옵션 정보를 조회하여 스냅샷(OrderLineItem) 생성
        List<OrderLineItem> orderLineItems = request.getOrderItems().stream().map(itemReq -> {

            ProductInternalApi.ProductOptionInfoDto optionInfo =
                    productInternalApi.getProductOptionInfo(itemReq.getProductOptionId());

            // 옵션 정보를 JSON(Map) 형태로 스냅샷 보존
            Map<String, String> optionSnapshot = Map.of(
                    "optionName", optionInfo.optionName(),
                    "additionalPrice", String.valueOf(optionInfo.additionalPrice())
            );

            return OrderLineItem.builder()
                    .productOptionId(itemReq.getProductOptionId())
                    .productName(optionInfo.productName())
                    .unitPrice(optionInfo.basePrice() + optionInfo.additionalPrice())
                    .quantity(itemReq.getQuantity())
                    .options(optionSnapshot)
                    .build();
        }).collect(Collectors.toList());

        // 3. 총 결제 금액 계산
        int totalAmount = orderLineItems.stream()
                .mapToInt(OrderLineItem::getLineTotalAmount)
                .sum();

        // 4. 주문(Order) 엔티티 생성
        Order order = Order.builder()
                .memberId(memberId)
                .totalAmount(totalAmount)
                .orderStatus("PENDING_PAYMENT")
//                .deliveryAddress(request.getDeliveryAddress())
                // 쿠폰, 결제수단 등은 엔티티 필드 상황에 맞게 매핑
                .build();

        // 연관관계 편의 메서드 호출
        orderLineItems.forEach(order::addLineItem);

        // 5. DB 저장
        Order savedOrder = orderRepository.save(order);

        log.info("주문 생성 완료 - orderId: {}, memberId: {}", savedOrder.getId(), memberId);

        // TODO: 이후 결제(Payment) 임시 결제 로직 호출 흐름으로 이어짐

        return savedOrder.getId();
    }
}