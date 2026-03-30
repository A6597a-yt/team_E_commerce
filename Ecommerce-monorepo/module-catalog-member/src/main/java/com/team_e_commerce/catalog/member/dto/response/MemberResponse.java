package com.team_e_commerce.catalog.member.dto.response;

import com.team_e_commerce.catalog.member.domain.Member;
import com.team_e_commerce.catalog.member.domain.MemberRole;

public record MemberResponse(
        Long id,
        String email,
        String name,
        MemberRole role
) {
    // 엔티티를 DTO로 변환하는 정적 팩토리 메서드
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getEmail(),
                member.getName(),
                member.getRole()
        );
    }
}