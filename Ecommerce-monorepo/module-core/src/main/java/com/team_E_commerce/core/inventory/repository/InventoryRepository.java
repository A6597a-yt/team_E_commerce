package com.team_E_commerce.core.inventory.repository;

import com.team_E_commerce.core.inventory.domain.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductId(Long productId);

}