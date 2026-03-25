package com.team_e_commerce.common.resolver;

import com.team_e_commerce.common.annotation.LoginMemberId;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
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
            // ★ IllegalArgumentException에서 BusinessException으로 교체
            throw new BusinessException(ErrorCode.UNAUTHORIZED_USER);
        }

        return Long.valueOf(memberId.toString());
    }
}