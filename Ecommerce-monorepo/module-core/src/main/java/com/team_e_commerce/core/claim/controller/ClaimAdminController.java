package com.team_e_commerce.core.claim.controller;

import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.core.claim.facade.ClaimAdminFacade;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated // 💡 PathVariable 유효성 검증(@Positive)을 활성화하기 위해 추가
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/claims")
@PreAuthorize("hasRole('ADMIN')") // 💡 진입점부터 관리자 권한을 완벽히 통제
public class ClaimAdminController {

    private final ClaimAdminFacade claimAdminFacade;

    // 1. 처리 시작 상태로 변경 (PATCH)
    @PatchMapping("/{claimId}/start-processing")
    public ApiResponse<Void> startProcessingClaim(
            @AuthenticationPrincipal Long adminId,
            @PathVariable @Positive(message = "올바른 클레임 ID를 입력해 주세요.") Long claimId // 💡 비정상적인 ID 차단 방어벽
    ) {
        claimAdminFacade.startProcessingClaim(adminId, claimId);
        return ApiResponse.ok("클레임 처리가 시작되었습니다.", null);
    }

    // 2. 환불 승인 (PATCH)
    @PatchMapping("/{claimId}/approve")
    public ApiResponse<Void> approveClaim(
            @AuthenticationPrincipal Long adminId,
            @PathVariable @Positive(message = "올바른 클레임 ID를 입력해 주세요.") Long claimId // 💡 비정상적인 ID 차단 방어벽
    ) {
        claimAdminFacade.approveClaim(adminId, claimId);
        return ApiResponse.ok("클레임이 정상적으로 승인 및 환불 처리되었습니다.", null);
    }

    // 3. 환불 거절 (PATCH)
    @PatchMapping("/{claimId}/reject")
    public ApiResponse<Void> rejectClaim(
            @AuthenticationPrincipal Long adminId,
            @PathVariable @Positive(message = "올바른 클레임 ID를 입력해 주세요.") Long claimId, // 💡 비정상적인 ID 차단 방어벽
            @Valid @RequestBody ClaimRejectRequest request
    ) {
        claimAdminFacade.rejectClaim(adminId, claimId, request.rejectReason());
        return ApiResponse.ok("클레임이 거절되었습니다.", null);
    }

    // 어드민 거절 사유 전용 인라인 DTO (기존 코드 그대로 보존)
    public record ClaimRejectRequest(
            @NotBlank(message = "거절 사유는 반드시 입력해야 합니다.")
            String rejectReason
    ) {}
}