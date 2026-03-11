package com.team_E_commerce.core.claim.controller;

import com.team_E_commerce.common.annotation.LoginMemberId;
import com.team_E_commerce.common.response.ApiResponse;
import com.team_E_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_E_commerce.core.claim.dto.ClaimResponse;
import com.team_E_commerce.core.claim.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ApiResponse<List<ClaimResponse>> createClaim(
            @LoginMemberId Long memberId,
            @Valid @RequestBody ClaimCreateRequest request) { // 에러 나면 글로벌 핸들러가 출동

        // 1. 서비스 계층으로 비즈니스 로직 위임 (1개 이상의 클레임이 생성되어 반환됨)
        List<ClaimResponse> responses = claimService.createClaims(memberId, request);

        // 2. 외부 통신용 성공 껍데기(201 Created)로 예쁘게 포장해서 프론트엔드에 전달
        return ApiResponse.created(responses);
    }
}