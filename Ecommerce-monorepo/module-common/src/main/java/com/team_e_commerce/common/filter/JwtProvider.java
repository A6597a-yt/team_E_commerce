package com.team_e_commerce.common.filter;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtProvider {

    private final SecretKey secretKey;
    private final long accessTokenValidityInMilliseconds;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-validity-in-seconds}") long accessTokenValidityInSeconds) {
        // JJWT 최신 스펙: 문자열 키를 HMAC SHA 키 객체로 변환
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidityInMilliseconds = accessTokenValidityInSeconds * 1000;
    }

    // 1. JWT 생성 로직
    public String createToken(Long memberId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .subject(String.valueOf(memberId)) // 식별자를 subject에 저장
                .issuedAt(now)
                .expiration(validity)
                .signWith(secretKey) // 최신 스펙의 서명 방식
                .compact();
    }

    // 2. JWT 검증 및 식별자 추출 로직
    public Long validateTokenAndGetSubject(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey) // 위변조 방지를 위한 서명 검증
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Long.parseLong(claims.getSubject());

        } catch (JwtException | IllegalArgumentException e) {
            // 서명 불일치, 만료, 형식이 잘못된 토큰일 경우 예외 발생
            throw new BusinessException(ErrorCode.UNAUTHORIZED_USER);
        }
    }
}