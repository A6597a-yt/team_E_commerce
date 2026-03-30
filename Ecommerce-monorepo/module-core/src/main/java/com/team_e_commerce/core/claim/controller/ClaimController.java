package com.team_e_commerce.core.claim.controller;

import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.common.response.PageResponse;
import com.team_e_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_e_commerce.core.claim.dto.ClaimResponse;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import com.team_e_commerce.core.claim.facade.ClaimFacade;
import com.team_e_commerce.core.claim.service.ClaimService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated // PathVariable 유효성 검증(@Positive)을 활성화하기 위해 추가
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/claims")
public class ClaimController {

    private final ClaimFacade claimFacade;
    private final ClaimService claimService;

    // 1. 클레임 접수 (POST)
    @PostMapping
    public ApiResponse<List<ClaimResponse>> createClaims(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody ClaimCreateRequest request
    ) {
        // 서비스 직접 호출에서 퍼사드 위임으로 변경 (분산 락 및 타 모듈 데이터 조회 적용)
        List<ClaimResponse> responses = claimFacade.createClaims(memberId, request);
        return ApiResponse.created(responses); // 201 응답과 함께 생성된 데이터 반환
    }

    // 2. 내 클레임 내역 조회 (GET)
    @GetMapping
    public ApiResponse<PageResponse<ClaimResponse>> getClaimHistory(
            @AuthenticationPrincipal Long memberId,
            @ModelAttribute ClaimSearchCondition condition,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        // 단순 조회는 Facade를 거칠 필요 없이 Service로 직행
        Page<ClaimResponse> claimPage = claimService.getClaimHistory(memberId, condition, pageable);
        return ApiResponse.ok(new PageResponse<>(claimPage));
    }

    // 3. 클레임 철회 (PATCH)
    @PatchMapping("/{claimId}/withdraw")
    public ApiResponse<Void> withdrawClaim(
            @AuthenticationPrincipal Long memberId,
            @PathVariable @Positive(message = "올바른 클레임 ID를 입력해 주세요.") Long claimId
    ) {
        // 단순 상태 변경이므로 Service로 직행
        claimService.withdrawClaim(memberId, claimId);
        // 프론트엔드와 어드민 API와의 일관성을 위해 성공 메시지 추가
        return ApiResponse.ok("클레임이 정상적으로 철회되었습니다.", null);
    }
}