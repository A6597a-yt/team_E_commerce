package com.team_E_commerce.common.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ValidEnumValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidEnum {
    String message() default "지원하지 않는 형식의 값입니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    // 검증할 Enum 클래스를 지정받습니다.
    Class<? extends java.lang.Enum<?>> enumClass();
}