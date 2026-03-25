package com.team_e_commerce.core.inventory.domain;

import com.team_e_commerce.common.entity.BaseEntity;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "inventory")
// ★ 핵심: 총 재고가 0 이상, 점유 재고가 0 이상, 그리고 총 재고가 점유 재고보다 항상 크거나 같아야 함을 DB 레벨에서 강제
@Check(constraints = "total_quantity >= 0 AND allocated_quantity >= 0 AND total_quantity >= allocated_quantity")
public class Inventory extends BaseEntity {

    @Id
    @Column(name = "product_id") // 상품 ID를 그대로 PK로 사용 (1:1 식별 관계)
    private Long productId;

    @Column(nullable = false)
    private Long totalQuantity; // 창고에 있는 총 물리 재고

    @Column(nullable = false)
    private Long allocatedQuantity; // 결제 대기 중인 점유 재고

    @Version // 낙관적 락을 위한 버전 관리
    private Long version;

    @Builder
    public Inventory(Long productId, Long totalQuantity) {
        this.productId = productId;
        this.totalQuantity = totalQuantity;
        this.allocatedQuantity = 0L;
    }

    // 1. 가용 재고 계산
    public Long getAvailableQuantity() {
        return this.totalQuantity - this.allocatedQuantity;
    }

    // 2. 재고 점유 (주문 생성 시점)
    public void allocate(Long quantity) {
        if (quantity <= 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
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

    // 4. 점유 해제 (결제 실패, 이탈, 좀비 재고 복구 시점)
    public void restoreAllocated(Long quantity) {
        if (this.allocatedQuantity < quantity) {
            this.allocatedQuantity = 0L; // 방어 로직 (DB Check와 이중 방어)
        } else {
            this.allocatedQuantity -= quantity;
        }
    }

    // 관리자용 재고 증가
    public void increaseTotalQuantity(Long amount) {
        if (amount <= 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
        this.totalQuantity += amount;
    }

    // 관리자용 재고 차감
    public void decreaseTotalQuantity(Long amount) {
        if (amount <= 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
        // 점유된 재고를 제외한 '가용 재고' 한도 내에서만 차감 가능
        if (getAvailableQuantity() < amount) {
            throw new BusinessException(ErrorCode.OUT_OF_STOCK);
        }
        this.totalQuantity -= amount;
    }
}