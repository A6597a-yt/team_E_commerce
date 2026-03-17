package com.team_e_commerce.core.claim.repository;

import com.team_e_commerce.core.claim.domain.Claim;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClaimRepositoryCustom {
    Page<Claim> searchClaims(Long memberId, ClaimSearchCondition condition, Pageable pageable);
}