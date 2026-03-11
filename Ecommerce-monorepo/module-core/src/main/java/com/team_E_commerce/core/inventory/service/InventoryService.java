package com.team_E_commerce.core.inventory.service;

import com.team_E_commerce.core.inventory.domain.Inventory;
import com.team_E_commerce.core.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional
    public void decreaseStock(Long productId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("재고 정보를 찾을 수 없습니다."));

        // 재고 부족 시 여기서 OutOfStockException 발생
        inventory.decrease(quantity);
    }
}