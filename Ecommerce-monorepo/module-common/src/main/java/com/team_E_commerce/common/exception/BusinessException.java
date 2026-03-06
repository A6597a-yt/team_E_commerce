package com.team_E_commerce.common.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    // 기본적으로 ErrorCode에 정의된 메시지를 사용.
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    // 더 상세한 메시지를 덧붙이고 싶을 때.
    public BusinessException(ErrorCode errorCode, String detailMessage) {
        super(detailMessage);
        this.errorCode = errorCode;
    }
}