package com.team_e_commerce.support.cs.controller;

import com.team_e_commerce.common.annotation.LoginMemberId;
import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.support.cs.dto.TicketCreateRequest;
import com.team_e_commerce.support.cs.dto.TicketResponse;
import com.team_e_commerce.support.cs.service.CsTicketService;
// DTO 클래스는 임의로 가정한 이름입니다. 실제 작성하신 DTO 패키지 경로를 임포트하세요.
// import com.team_e_commerce.support.cs.dto.*;
// import com.team_e_commerce.support.cs.dto.TicketResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * CS 티켓 관련 API 컨트롤러
 * 컨트롤러 응답 규약에 따라 모든 반환값은 무조건 ApiResponse<T>를 사용합니다. [cite: 66]
 */
@RestController
@RequestMapping("/api/v1/cs/tickets")
@RequiredArgsConstructor
public class CsTicketController {

    private final CsTicketService csTicketService;

    /**
     * 상담 티켓 생성 API
     * @Valid를 통해 DTO 내부의 조건(@NotBlank 등)을 검증하여 에러 발생 시 공통 규격으로 반환합니다. [cite: 74, 75]
     * @LoginMemberId 커스텀 어노테이션으로 현재 로그인한 유저의 ID를 주입받습니다. [cite: 76, 77]
     */
    @PostMapping
    public ApiResponse<TicketResponse> createTicket(
            @LoginMemberId Long memberId,
            @Valid @RequestBody TicketCreateRequest request) {

        TicketResponse response = csTicketService.createTicket(memberId, request);

        // 데이터가 포함된 성공 응답 시 ApiResponse.ok()를 사용합니다. [cite: 67]
        return ApiResponse.ok(response);
    }

    /**
     * 티켓 삭제 API (예시)
     * 데이터가 없는 단순 성공 응답의 경우 ApiResponse.ok()를 호출합니다. (내부적으로 data 필드 null 처리) [cite: 69]
     */
    @DeleteMapping("/{ticketId}")
    public ApiResponse<Void> deleteTicket(
            @LoginMemberId Long memberId,
            @PathVariable Long ticketId) {

        csTicketService.deleteTicket(memberId, ticketId);

        return ApiResponse.ok();
    }
}