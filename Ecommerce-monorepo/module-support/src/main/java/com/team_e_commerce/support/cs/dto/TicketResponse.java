package com.team_e_commerce.support.cs.dto;

import com.team_e_commerce.support.cs.domain.CsTicket;

public record TicketResponse(
        Long ticketId,
        String title,
        String status
) {
    public static TicketResponse from(CsTicket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getStatus().name()
        );
    }
}