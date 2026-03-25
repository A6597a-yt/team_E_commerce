package com.team_e_commerce.core.claim.repository;

import com.team_e_commerce.core.claim.entity.Claim;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClaimRepositoryCustom {

    // 1. 관리자 전체 클레임 조회용
    Page<Claim> searchClaims(ClaimSearchCondition condition, Pageable pageable);

    // 2. 고객 본인 클레임 조회용
    Page<Claim> searchClaims(Long memberId, ClaimSearchCondition condition, Pageable pageable);

}