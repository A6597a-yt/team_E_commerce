// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/inventory/domain/Inventory.java
package com.team_e_commerce.core.inventory.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inventory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 카탈로그 모듈의 상품 옵션(SKU) 식별자 참조
    @Column(nullable = false, unique = true)
    private Long productOptionId;

    // 점유된(결제 대기 중인) 재고
    @Column(nullable = false)
    private Long allocatedQuantity;

    // 전체 재고 (실제 물리적 재고)
    @Column(nullable = false)
    private Long totalQuantity;

    @Version // 낙관적 락 보장
    private Long version;

    @Builder
    public Inventory(Long productOptionId, Long allocatedQuantity, Long totalQuantity) {
        this.productOptionId = productOptionId;
        this.allocatedQuantity = allocatedQuantity != null ? allocatedQuantity : 0L;
        this.totalQuantity = totalQuantity != null ? totalQuantity : 0L;
    }

    public void addStock(int offsetQuantity) {
        this.totalQuantity += offsetQuantity;
    }

    // 1. 가용 재고 계산
    public Long getAvailableQuantity() {
        return this.totalQuantity - this.allocatedQuantity;
    }

    // 2. 재고 점유 (주문서 생성 시점)
    public void allocateStock(Long quantity) {
        if (getAvailableQuantity() < quantity) {
            throw new BusinessException(ErrorCode.OUT_OF_STOCK);
        }
        this.allocatedQuantity += quantity;
    }

    // 3. 재고 차감 (결제 완료 시점)
    public void deductAllocated(Long quantity) {
        if (this.allocatedQuantity < quantity || this.totalQuantity < quantity) {
            throw new BusinessException(ErrorCode.OUT_OF_STOCK);
        }
        this.allocatedQuantity -= quantity;
        this.totalQuantity -= quantity;
    }

    // 4. 점유 해제 (결제 실패, 이탈, 티켓 취소 등 복구 시점)
    public void restoreAllocated(Long quantity) {
        if (this.allocatedQuantity < quantity) {
            this.allocatedQuantity = 0L; // 방어 로직
        } else {
            this.allocatedQuantity -= quantity;
        }
    }

    // 5. 관리자용 재고 증가/차감
    public void increaseTotalQuantity(Long amount) {
        if (amount <= 0) throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        this.totalQuantity += amount;
    }

    public void decreaseTotalQuantity(Long amount) {
        if (amount <= 0) throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        if (getAvailableQuantity() < amount) throw new BusinessException(ErrorCode.OUT_OF_STOCK);
        this.totalQuantity -= amount;
    }
}