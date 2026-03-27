package com.team_e_commerce.catalog.product.controller; // 본인 패키지 경로에 맞게 유지

import com.team_e_commerce.common.filter.JwtProvider; // 실제 JwtProvider 경로 확인 필요
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test/token")
@RequiredArgsConstructor
public class TestTokenController {

    private final JwtProvider jwtProvider;

    @GetMapping("/{memberId}")
    public String getTestToken(@PathVariable Long memberId) {
        return jwtProvider.createToken(memberId);
    }
}