package com.team_e_commerce.catalog.member.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MemberRole {
    // Spring Security의 권한 체계(Role Hierarchy)를 고려하여 "ROLE_" 접두사를 사용합니다.
    USER("ROLE_USER", "일반 사용자"),
    SELLER("ROLE_SELLER", "판매자"),
    ADMIN("ROLE_ADMIN", "관리자");

    private final String key;
    private final String title;
}