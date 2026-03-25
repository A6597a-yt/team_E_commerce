package com.team_e_commerce.core.inventory.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "inventory_history")
public class InventoryHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false) // 식별자인 productId로 Join
    private Inventory inventory;

    @Column(nullable = false)
    private Long orderId; // 타 모듈(주문)의 식별자 (Soft Reference)

    @Column(nullable = false)
    private Long quantity; // 변동된 수량

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InventoryHistoryType type; // 변동 타입

    @Builder
    public InventoryHistory(Inventory inventory, Long orderId, Long quantity, InventoryHistoryType type) {
        this.inventory = inventory;
        this.orderId = orderId;
        this.quantity = quantity;
        this.type = type;
    }
}