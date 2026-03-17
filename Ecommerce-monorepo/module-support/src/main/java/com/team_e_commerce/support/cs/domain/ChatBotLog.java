package com.team_e_commerce.support.cs.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatBotLog extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 비회원도 사용할 수 있다면 nullable = true로 두지만, 여기서는 회원 전용으로 가정
    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String userMessage; // 고객이 입력한 질문

    @Column(nullable = false, columnDefinition = "TEXT")
    private String botResponse; // 챗봇이 응답한 내용

    @Builder
    public ChatBotLog(Long memberId, String userMessage, String botResponse) {
        this.memberId = memberId;
        this.userMessage = userMessage;
        this.botResponse = botResponse;
    }
}