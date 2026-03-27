// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/inventory/facade/InventoryRetryFacade.java
package com.team_e_commerce.core.inventory.facade;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.core.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InventoryRetryFacade {

    private final InventoryService inventoryService;
    private static final int MAX_RETRIES = 30;
    private static final int WAIT_TIME_MS = 50;

    public void decreaseStockWithRetry(Long productOptionId, Long quantity) {
        int retryCount = 0;

        while (retryCount < MAX_RETRIES) {
            try {
                inventoryService.allocateStock(productOptionId, quantity);
                return;
            } catch (ObjectOptimisticLockingFailureException e) {
                retryCount++;
                log.warn("재고 차감 낙관적 락 충돌. 재시도 횟수: {}/{}", retryCount, MAX_RETRIES);

                try {
                    Thread.sleep(WAIT_TIME_MS);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                    throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
                }
            }
        }

        throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR); // 최대 재시도 초과 에러
    }
}