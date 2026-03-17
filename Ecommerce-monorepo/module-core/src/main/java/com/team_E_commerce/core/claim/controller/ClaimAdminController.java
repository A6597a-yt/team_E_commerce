package com.team_E_commerce.core.claim.controller;

import com.team_E_commerce.common.response.ApiResponse;
import com.team_E_commerce.core.claim.service.ClaimAdminService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/claims")
public class ClaimAdminController {

    private final ClaimAdminService claimAdminService;

    // 1. 처리 시작 상태로 변경 (PATCH)
    @PatchMapping("/{claimId}/start-processing")
    public ApiResponse<Void> startProcessingClaim(
            @AuthenticationPrincipal Long adminId,
            @PathVariable Long claimId
    ) {
        claimAdminService.startProcessingClaim(adminId, claimId);
        return ApiResponse.ok("클레임 처리가 시작되었습니다.", null);
    }

    // 2. 환불 승인 (PATCH)
    @PatchMapping("/{claimId}/approve")
    public ApiResponse<Void> approveClaim(
            @AuthenticationPrincipal Long adminId,
            @PathVariable Long claimId
    ) {
        claimAdminService.approveClaim(adminId, claimId);
        return ApiResponse.ok("클레임이 정상적으로 승인 및 환불 처리되었습니다.", null);
    }

    // 3. 환불 거절 (PATCH)
    @PatchMapping("/{claimId}/reject")
    public ApiResponse<Void> rejectClaim(
            @AuthenticationPrincipal Long adminId,
            @PathVariable Long claimId,
            @Valid @RequestBody ClaimRejectRequest request // ★ 거절 사유를 JSON Body로 받기 위한 전용 record DTO
    ) {
        claimAdminService.rejectClaim(adminId, claimId, request.rejectReason());
        return ApiResponse.ok("클레임이 거절되었습니다.", null);
    }

    // 어드민 거절 사유 전용 인라인 DTO
    public record ClaimRejectRequest(
            @NotBlank(message = "거절 사유는 반드시 입력해야 합니다.")
            String rejectReason
    ) {}
}