// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/inventory/domain/InventoryRepository.java
package com.team_e_commerce.core.inventory.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductOptionId(Long productOptionId);
}