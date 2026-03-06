package com.team_E_commerce.core.inventory.facade;

import com.team_E_commerce.core.inventory.domain.InventoryConflictException;
import com.team_E_commerce.core.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryRetryFacade {

    private final InventoryService inventoryService;
    private static final int MAX_RETRIES = 30; // 최대 30번 재도전
    private static final long WAIT_TIME_MS = 50; // 50ms 대기

    public void decreaseStockWithRetry(Long productId, int quantity) {
        int retryCount = 0;

        while (true) {
            try {
                // 서비스 호출
                inventoryService.decreaseStock(productId, quantity);
                break; // 성공하면 즉시 루프 탈출

            } catch (ObjectOptimisticLockingFailureException e) {
                // 누군가 먼저 재고를 수정해서 버전이 어긋난 경우
                retryCount++;
                if (retryCount > MAX_RETRIES) {
                    log.error("재고 차감 최대 재시도 횟수 초과. productId: {}", productId);
                    throw new InventoryConflictException("접속자가 많아 결제에 실패했습니다. 다시 시도해 주세요.");
                }

                try {
                    Thread.sleep(WAIT_TIME_MS); // 0.05초 대기 후 재도전
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("재시도 대기 중 인터럽트 발생", ie);
                }
            }

        }
    }
}