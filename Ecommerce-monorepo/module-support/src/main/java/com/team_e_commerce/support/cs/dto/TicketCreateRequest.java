package com.team_e_commerce.support.cs.dto;

import jakarta.validation.constraints.NotBlank;

public record TicketCreateRequest(
        @NotBlank(message = "제목은 필수입니다.")
        String title,

        @NotBlank(message = "내용은 필수입니다.")
        String content
) {}