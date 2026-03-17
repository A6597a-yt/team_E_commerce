package com.team_e_commerce.common.resolver;

import com.team_e_commerce.common.annotation.LoginMemberId;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class LoginMemberIdArgumentResolver implements HandlerMethodArgumentResolver {

    // 리졸버가 동작할 조건을 검사.
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // @LoginMemberId 어노테이션이 붙어 있고, 파라미터 타입이 Long인지 확인
        boolean hasAnnotation = parameter.hasParameterAnnotation(LoginMemberId.class);
        boolean isLongType = Long.class.isAssignableFrom(parameter.getParameterType());
        return hasAnnotation && isLongType;
    }

    // 2. 조건이 맞으면 실제 값을 추출해서 컨트롤러에 꽂아줍니다.
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        Object memberId = request.getAttribute("MEMBER_ID");

        if (memberId == null) {
            // 비인증 사용자가 접근했을 때의 방어 로직
            throw new IllegalArgumentException("인증된 사용자 정보가 없습니다.");
        }

        return Long.valueOf(memberId.toString());
    }
}