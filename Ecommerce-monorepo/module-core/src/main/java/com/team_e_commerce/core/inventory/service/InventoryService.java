// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/inventory/service/InventoryService.java
package com.team_e_commerce.core.inventory.service;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.core.inventory.domain.Inventory;
import com.team_e_commerce.core.inventory.domain.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional
    public void allocateStock(Long productOptionId, Long quantity) {
        Inventory inventory = inventoryRepository.findByProductOptionId(productOptionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        inventory.allocateStock(quantity);
    }

    @Transactional
    public void restoreAllocated(Long productOptionId, Long quantity) {
        Inventory inventory = inventoryRepository.findByProductOptionId(productOptionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
        inventory.restoreAllocated(quantity);
    }
}