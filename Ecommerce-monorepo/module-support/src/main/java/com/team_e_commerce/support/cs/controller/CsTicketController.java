package com.team_e_commerce.support.cs.controller;

import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.support.cs.dto.TicketCreateRequest;
import com.team_e_commerce.support.cs.dto.TicketResponse;
import com.team_e_commerce.support.cs.service.CsTicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * CS 티켓 관련 API 컨트롤러
 * 컨트롤러 응답 규약에 따라 모든 반환값은 무조건 ApiResponse<T>를 사용합니다.
 */
@RestController
@RequestMapping("/api/v1/cs/tickets")
@RequiredArgsConstructor
public class CsTicketController {

    private final CsTicketService csTicketService;

    /**
     * 상담 티켓 생성 API
     * @Valid를 통해 DTO 내부의 조건(@NotBlank 등)을 검증하여 에러 발생 시 공통 규격으로 반환합니다.
     */
    @PostMapping
    public ApiResponse<TicketResponse> createTicket(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody TicketCreateRequest request) {

        TicketResponse response = csTicketService.createTicket(memberId, request);
        return ApiResponse.ok(response);
    }

    /**
     * 티켓 삭제 API (예시)
     * 데이터가 없는 단순 성공 응답의 경우 ApiResponse.ok()를 호출합니다.
     */
    @DeleteMapping("/{ticketId}")
    public ApiResponse<Void> deleteTicket(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long ticketId) {

        csTicketService.deleteTicket(memberId, ticketId);
        return ApiResponse.ok();
    }
}