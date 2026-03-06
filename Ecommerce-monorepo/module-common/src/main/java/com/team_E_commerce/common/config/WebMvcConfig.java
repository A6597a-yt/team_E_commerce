package com.team_E_commerce.common.config;

import com.team_E_commerce.common.resolver.LoginMemberIdArgumentResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final LoginMemberIdArgumentResolver loginMemberIdArgumentResolver;

    // 스프링이 컨트롤러 파라미터를 분석할 때, 리졸버도 같이 쓰도록 목록에 추가.
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(loginMemberIdArgumentResolver);
    }

    // 페이징 커스텀 설정 등록
    @Bean
    public PageableHandlerMethodArgumentResolverCustomizer pageableCustomizer() {
        return resolver -> {
            // 프론트엔드가 1을 보내면 스프링 내부적으로 0으로 변환.
            resolver.setOneIndexedParameters(true);

            // 기본 1페이지(내부 0), 20개 사이즈로 고정.
            resolver.setFallbackPageable(PageRequest.of(0, 20));
        };
    }
}