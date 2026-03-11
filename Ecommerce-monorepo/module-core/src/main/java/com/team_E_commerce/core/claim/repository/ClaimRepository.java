package com.team_E_commerce.core.claim.repository;

import com.team_E_commerce.core.claim.domain.Claim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    // ★ 마이페이지(내 취소/반품 내역 보기) 조회를 위한 핵심 메서드
    // memberId로 인덱스를 타서 수백만 건의 데이터 중 내 것만 빠르게(Pageable) 가져옵니다.
    Page<Claim> findByMemberId(Long memberId, Pageable pageable);
}