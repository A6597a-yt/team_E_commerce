package com.team_e_commerce.support.cs.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 고객센터 상담 티켓 엔티티 [cite: 48]
 * 공통 시간 기록을 위해 BaseTimeEntity를 상속받습니다. [cite: 70]
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CsTicket extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 타 도메인 객체 참조 금지(Soft Reference). 회원의 고유 식별자(ID)만 저장합니다. [cite: 71, 72]
    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String title; // 문의 제목

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 문의 상세 내용

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status; // 처리 상태

    // 답변 내용 (초기엔 null, ANSWERED 상태일 때 값이 채워짐)
    @Column(columnDefinition = "TEXT")
    private String answer;

    @Builder
    public CsTicket(Long memberId, String title, String content) {
        this.memberId = memberId;
        this.title = title;
        this.content = content;
        this.status = TicketStatus.WAITING; // 생성 시 무조건 대기 상태
    }

    // 비즈니스 로직: 답변 등록 및 상태 변경
    public void answerTicket(String answer) {
        this.answer = answer;
        this.status = TicketStatus.ANSWERED;
    }
}