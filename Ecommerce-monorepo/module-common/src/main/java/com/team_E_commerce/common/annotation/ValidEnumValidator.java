package com.team_E_commerce.common.annotation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidEnumValidator implements ConstraintValidator<ValidEnum, String> {
    private ValidEnum annotation;

    @Override
    public void initialize(ValidEnum constraintAnnotation) {
        this.annotation = constraintAnnotation;
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // null 처리는 @NotNull 등 다른 어노테이션에 맡기고, 여기서는 값 자체만 검증합니다.
        if (value == null || value.isBlank()) {
            return false;
        }

        Object[] enumValues = this.annotation.enumClass().getEnumConstants();
        if (enumValues != null) {
            for (Object enumValue : enumValues) {
                if (value.equals(enumValue.toString())) {
                    return true;
                }
            }
        }
        return false; // 일치하는 Enum이 없으면 검증 실패
    }
}