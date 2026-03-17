package com.team_e_commerce.core.claim.controller;

import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.common.response.PageResponse;
import com.team_e_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_e_commerce.core.claim.dto.ClaimResponse;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import com.team_e_commerce.core.claim.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/claims")
public class ClaimController {

    private final ClaimService claimService;

    // 1. 클레임 접수
    @PostMapping
    public ApiResponse<List<ClaimResponse>> createClaims(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody ClaimCreateRequest request
    ) {
        List<ClaimResponse> responses = claimService.createClaims(memberId, request);
        return ApiResponse.created(responses); // 201 응답과 함께 생성된 데이터 반환
    }

    // 내 클레임 내역 조회 (GET)
    @GetMapping
    public ApiResponse<PageResponse<ClaimResponse>> getClaimHistory(
            @AuthenticationPrincipal Long memberId,
            @ModelAttribute ClaimSearchCondition condition,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<ClaimResponse> claimPage = claimService.getClaimHistory(memberId, condition, pageable);

        // 공통 모듈인 PageResponse로 감싸서 반환
        return ApiResponse.ok(new PageResponse<>(claimPage));
    }

    // 3. 클레임 철회 (PATCH)
    @PatchMapping("/{claimId}/withdraw")
    public ApiResponse<Void> withdrawClaim(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long claimId
    ) {
        claimService.withdrawClaim(memberId, claimId);
        return ApiResponse.ok();
    }
}