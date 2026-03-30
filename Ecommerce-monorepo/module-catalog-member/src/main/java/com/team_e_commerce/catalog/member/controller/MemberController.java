package com.team_e_commerce.catalog.member.controller;

import com.team_e_commerce.catalog.member.dto.request.LoginRequest;
import com.team_e_commerce.catalog.member.dto.request.SignUpRequest;
import com.team_e_commerce.catalog.member.service.MemberService;
import com.team_e_commerce.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ApiResponse<Long> signUp(@RequestBody @Valid SignUpRequest request) {
        return ApiResponse.ok(memberService.signUp(request.email(), request.password(), request.name()));
    }

    @PostMapping("/login")
    public ApiResponse<String> login(@RequestBody LoginRequest request) {
        return ApiResponse.ok(memberService.login(request.email(), request.password()));
    }

    @GetMapping("/me")
    public ApiResponse<Long> getMyId(@AuthenticationPrincipal Long memberId) {
        return ApiResponse.ok(memberId);
    }
}