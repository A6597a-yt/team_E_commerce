package com.team_E_commerce.core.order.domain;

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
public class OrderLineItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // N:1 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Long productId;

    // 상품명
    @Column(nullable = false)
    private String productName;

    // 수량 및 금액
    @Column(nullable = false)
    private Integer unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer lineTotalAmount;

    // 다중 옵션 JSON 컨버터 적용 및 TEXT 타입 지정
    @Convert(converter = OrderOptionConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, String> options = new HashMap<>();

    @Builder
    public OrderLineItem(Long productId, String productName, Integer unitPrice, Integer quantity, Map<String, String> options) {
        this.productId = productId;
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