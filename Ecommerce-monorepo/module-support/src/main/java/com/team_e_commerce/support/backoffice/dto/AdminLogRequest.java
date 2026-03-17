package com.team_e_commerce.support.backoffice.dto;

import com.team_e_commerce.support.backoffice.domain.AdminRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminLogRequest(
        @NotNull(message = "권한 정보는 필수입니다.")
        AdminRole role,

        @NotBlank(message = "작업 종류는 필수입니다.")
        String actionType,

        Long targetId,
        String actionDetails
) {}