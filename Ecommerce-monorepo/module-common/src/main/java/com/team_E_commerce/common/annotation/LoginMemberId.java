package com.team_E_commerce.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 파라미터에만 붙일 수 있도록 제한.
@Target(ElementType.PARAMETER)
// 런타임까지 이 어노테이션 정보가 살아있도록 설정.
@Retention(RetentionPolicy.RUNTIME)
public @interface LoginMemberId {

}