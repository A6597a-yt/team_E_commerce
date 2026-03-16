package com.team_e_commerce.support.cs.service;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.support.cs.domain.CsTicket;
import com.team_e_commerce.support.cs.domain.CsTicketRepository;
import com.team_e_commerce.support.cs.dto.TicketCreateRequest;
import com.team_e_commerce.support.cs.dto.TicketResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CsTicketService {

    private final CsTicketRepository csTicketRepository;

    @Transactional
    public TicketResponse createTicket(Long memberId, TicketCreateRequest request) {
        CsTicket ticket = CsTicket.builder()
                .memberId(memberId)
                .title(request.title())
                .content(request.content())
                .build();

        CsTicket savedTicket = csTicketRepository.save(ticket);
        return TicketResponse.from(savedTicket);
    }

    @Transactional
    public void deleteTicket(Long memberId, Long ticketId) {
        CsTicket ticket = csTicketRepository.findByIdAndMemberId(ticketId, memberId)
                // 본인의 티켓이 아니거나 없는 경우 공통 예외 처리
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_INPUT_VALUE));

        csTicketRepository.delete(ticket);
    }
}