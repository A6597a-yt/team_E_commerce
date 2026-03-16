package com.team_e_commerce.support.backoffice.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 관리자 활동 이력 엔티티 [cite: 47]
 * 공통 시간 기록을 위해 BaseTimeEntity를 상속받습니다. (생성일, 수정일 자동 기록) [cite: 70, 71]
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 기본 생성자 접근 제어
public class AdminActivityLog extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 타 도메인 객체 직접 참조 금지 원칙에 따라, 관리자의 고유 식별자(ID)만 저장합니다. [cite: 71, 72]
    @Column(nullable = false)
    private Long adminId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminRole role; // 당시 관리자의 권한 스냅샷

    @Column(nullable = false)
    private String actionType; // 수행한 작업 종류 (예: "UPDATE_PRODUCT_PRICE")

    // 조작한 대상의 고유 ID (예: 상품 ID, 주문 ID)
    private Long targetId;

    // 상세 변경 내역 (JSON 형태나 텍스트로 저장)
    private String actionDetails;

    @Builder
    public AdminActivityLog(Long adminId, AdminRole role, String actionType, Long targetId, String actionDetails) {
        this.adminId = adminId;
        this.role = role;
        this.actionType = actionType;
        this.targetId = targetId;
        this.actionDetails = actionDetails;
    }
}