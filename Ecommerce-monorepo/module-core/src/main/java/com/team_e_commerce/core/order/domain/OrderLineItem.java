// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/order/domain/OrderLineItem.java
package com.team_e_commerce.core.order.domain;

import com.team_e_commerce.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderLineItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // 상품 ID 대신 옵션 ID(SKU)를 식별자로 사용
    @Column(nullable = false)
    private Long productOptionId;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Integer unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer lineTotalAmount;

    // 결제 당시 옵션 상태 스냅샷 저장용 JSON
    @Convert(converter = OrderOptionConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, String> options = new HashMap<>();

    @Builder
    public OrderLineItem(Long productOptionId, String productName, Integer unitPrice, Integer quantity, Map<String, String> options) {
        this.productOptionId = productOptionId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotalAmount = unitPrice * quantity;
        this.options = options != null ? options : new HashMap<>();
    }

    protected void setOrder(Order order) {
        this.order = order;
    }
}