package com.team_e_commerce.support.backoffice.domain;

/**
 * 관리자 권한 Enum [cite: 64]
 * 상태(Status) 대신 권한(Role)으로 활동 이력을 통제하기 위해 사용합니다. [cite: 64]
 */
public enum AdminRole {
    SUPER_ADMIN, // 최고 관리자: 모든 권한 보유 [cite: 64]
    MANAGER,     // 일반 관리자: 운영 필수 권한 보유 [cite: 64]
    CS_STAFF     // CS 담당자: 고객 응대 및 조회 권한 보유 [cite: 64]
}