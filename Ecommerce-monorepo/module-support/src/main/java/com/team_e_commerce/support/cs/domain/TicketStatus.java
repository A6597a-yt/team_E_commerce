package com.team_e_commerce.support.cs.domain;

/**
 * 고객센터 상담 티켓 상태 Enum [cite: 64]
 * 티켓의 처리 흐름을 관리합니다. [cite: 64]
 */
public enum TicketStatus {
    WAITING,     // 답변 대기 중 (초기 상태) [cite: 64]
    IN_PROGRESS, // 담당자 배정 및 처리 중 [cite: 64]
    ANSWERED,    // 답변 완료 [cite: 64]
    CLOSED       // 최종 종결 (고객 확인 완료 등) [cite: 64]
}