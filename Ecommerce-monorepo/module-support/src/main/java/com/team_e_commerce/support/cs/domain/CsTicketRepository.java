package com.team_e_commerce.support.cs.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CsTicketRepository extends JpaRepository<CsTicket, Long> {
    Optional<CsTicket> findByIdAndMemberId(Long id, Long memberId);
}