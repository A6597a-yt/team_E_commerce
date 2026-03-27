package com.team_e_commerce.common.filter;

import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

    // 테스트용 토큰 생성
    public String createToken(Long memberId) {
        return "test_token_" + memberId;
    }

    // test_token_ 으로 시작하면 검증 통과 처리
    public boolean validateToken(String token) {
        if (token == null) return false;
        return token.startsWith("test_token_");
    }

    // 토큰에서 memberId 추출 (예: test_token_1 -> 1)
    public Long getMemberId(String token) {
        try {
            return Long.parseLong(token.replace("test_token_", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}