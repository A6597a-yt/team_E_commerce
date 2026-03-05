package com.team_E_commerce.core.inventory.admin;

import com.team_E_commerce.core.inventory.domain.Inventory;
import com.team_E_commerce.core.inventory.domain.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminInventoryService {

    private final InventoryRepository inventoryRepository;

    // 관리자 재고 수정은 단일 트랜잭션으로 처리
    @Transactional
    public void adjustStock(Long productId, int offsetQuantity, Long adminId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("재고 정보를 찾을 수 없습니다. productId: " + productId));

        // 재고 증감 (+50, -5 등)
        inventory.addStock(offsetQuantity);

        log.info("관리자(adminId: {})가 상품(productId: {})의 재고를 {} 만큼 조정했습니다.", adminId, productId, offsetQuantity);

        // (향후 추가될 부분) Backoffice 모듈로 활동 이력(Audit) 전송
        // ex) backofficeInternalApi.logActivity(adminId, "INVENTORY_ADJUST", productId, offsetQuantity);
    }
}