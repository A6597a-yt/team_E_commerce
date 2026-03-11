package com.team_E_commerce.core.inventory.domain;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inventory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    // 카탈로그 모듈의 상품(또는 SKU) ID
    private Long productId;

    @Column(nullable = false)
    private Integer stockQuantity;

    // 수정될 때마다 JPA가 자동으로 1씩 증가시킵니다.
    @Version
    private Long version;

    public Inventory(Long productId, Integer stockQuantity) {
        this.productId = productId;
        this.stockQuantity = stockQuantity;
    }

    // 객체 스스로 재고를 차감합니다.
    public void decrease(int quantity) {
        // 음수나 0이 들어오는 경우 예방
        if (quantity <= 0) {
            throw new IllegalArgumentException("차감할 재고 수량은 1 이상이어야 합니다. 입력값: " + quantity);
        }

        // 남은 재고가 부족한지 확인
        if (this.stockQuantity - quantity < 0) {
            throw new OutOfStockException("재고가 부족합니다. 남은 수량: " + this.stockQuantity);
        }

        this.stockQuantity -= quantity;
    }

    // 관리자용 재고 수정 기능
    public void addStock(int offsetQuantity) {
        // 음수가 들어왔을 때, 현재 재고보다 더 많이 빼려고 하면 에러 발생
        if (this.stockQuantity + offsetQuantity < 0) {
            throw new IllegalArgumentException("재고는 0 미만으로 설정할 수 없습니다. 현재 재고: " + this.stockQuantity);
        }
        this.stockQuantity += offsetQuantity;
    }
}