package com.team_e_commerce.support.backoffice.controller;

import com.team_e_commerce.common.annotation.LoginMemberId;
import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.support.backoffice.dto.AdminLogRequest;
import com.team_e_commerce.support.backoffice.service.AdminActivityLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/logs")
@RequiredArgsConstructor
public class AdminActivityLogController {

    private final AdminActivityLogService adminActivityLogService;

    /**
     * 관리자 활동 이력 기록 API
     * (예: 타 도메인에서 관리자 작업이 일어났을 때 Internal API로 호출하거나, 백오피스 프론트에서 직접 호출)
     */
    @PostMapping
    public ApiResponse<Void> createLog(
            @LoginMemberId Long adminId,
            @Valid @RequestBody AdminLogRequest request) {

        adminActivityLogService.recordActivity(adminId, request);
        return ApiResponse.ok();
    }
}