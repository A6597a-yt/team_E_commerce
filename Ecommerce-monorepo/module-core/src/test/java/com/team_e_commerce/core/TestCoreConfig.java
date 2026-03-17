package com.team_e_commerce.core;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing; // 추가
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication(scanBasePackages = "com.team_e_commerce.core")
@EnableRetry
@EnableJpaAuditing // ★ 이 줄을 추가하여 자동 시간 입력을 활성화합니다.
public class TestCoreConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}