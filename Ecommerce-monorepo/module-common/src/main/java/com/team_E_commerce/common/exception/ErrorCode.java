package com.team_E_commerce.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 공통 에러 - CMM (Common)
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "CMM-400", "잘못된 입력값입니다."),
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "CMM-401", "인증이 필요한 요청입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "CMM-500", "서버 내부 오류가 발생했습니다."),

    // 재고 도메인 에러 - INV (Inventory)
    OUT_OF_STOCK(HttpStatus.BAD_REQUEST, "INV-001", "해당 상품의 재고가 부족합니다.");

    private final HttpStatus status;
    private final String code;     // 예: "INV-001"
    private final String message;  // 기본 알림창 문구
}