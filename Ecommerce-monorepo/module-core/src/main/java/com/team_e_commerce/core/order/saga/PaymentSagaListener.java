package com.team_e_commerce.core.order.saga;

import com.team_e_commerce.common.event.PaymentFailedEvent;
import com.team_e_commerce.core.inventory.service.InventoryService;
import com.team_e_commerce.core.order.domain.OrderLineItem;
import com.team_e_commerce.core.order.domain.OrderRepository;
import com.team_e_commerce.core.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentSagaListener {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    // 결제 트랜잭션 롤백 후 실행되도록 설정
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handlePaymentFailed(PaymentFailedEvent event) {
        log.warn("결제 실패로 인한 Saga 보상 트랜잭션 시작. orderId: {}", event.orderId());

        orderRepository.findById(event.orderId()).ifPresent(order -> {
            // 1. 주문 상태 취소
            order.updateStatus(OrderStatus.CANCELED);

            // 2. 재고 점유 해제 (productOptionId 기준)
            for (OrderLineItem item : order.getLineItems()) {
                inventoryService.restoreAllocated(item.getProductOptionId(), (long) item.getQuantity());
            }

            // (추후 프로모션 모듈 연동 시 쿠폰 복구 로직 추가)
        });
    }
}