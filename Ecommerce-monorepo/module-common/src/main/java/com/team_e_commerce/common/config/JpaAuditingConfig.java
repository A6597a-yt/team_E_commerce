package com.team_e_commerce.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
// 엔티티가 저장&수정될 때 auditorProvider를 호출하도록 지시
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            // 현재 스레드의 시큐리티 컨텍스트에서 인증 정보를 가져옵니다.
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // 인증 정보가 없거나, 비로그인(익명) 사용자일 경우 방어 로직
            if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
                return Optional.of("SYSTEM"); // 시스템 자동 배치나 비로그인 요청일 때의 기본값
            }

            // 로그인한 사용자의 ID(혹은 Username)를 반환하여 @CreatedBy, @LastModifiedBy 필드에 주입.
            return Optional.of(authentication.getName());
        };
    }
}