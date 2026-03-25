package com.team_e_commerce.common.config;

import com.team_e_commerce.common.resolver.LoginMemberIdArgumentResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@RequiredArgsConstructor // ★ 추가
public class WebMvcConfig implements WebMvcConfigurer {

    private final LoginMemberIdArgumentResolver loginMemberIdArgumentResolver; // ★ 추가

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(loginMemberIdArgumentResolver); // ★ 리졸버 등록
    }

    @Bean
    public PageableHandlerMethodArgumentResolverCustomizer pageableCustomizer() {
        return resolver -> {
            resolver.setOneIndexedParameters(true);
            resolver.setFallbackPageable(PageRequest.of(0, 20));
        };
    }

}