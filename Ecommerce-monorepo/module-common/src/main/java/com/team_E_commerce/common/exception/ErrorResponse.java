package com.team_E_commerce.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Builder(access = AccessLevel.PRIVATE)
public class ErrorResponse {

    private final LocalDateTime timestamp; // 에러 발생 시간
    private final int status;              // HTTP 상태 코드
    private final String code;             // 도메인별 고유 에러 코드
    private final String message;          // 프론트 알림창용 문구
    private final String path;             // 에러가 발생한 API 주소

    // errors가 비어있으면 JSON 응답에서 아예 제외시킴 (트래픽 절약 및 깔끔한 파싱)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<FieldErrorDetail> errors;

    // 1. 단일 비즈니스 에러용 (errors 배열 없음)
    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .errors(new ArrayList<>())
                .build();
    }

    // 2. 외부 메시지 주입용 단일 에러
    public static ErrorResponse of(ErrorCode errorCode, String message, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .message(message)
                .path(path)
                .errors(new ArrayList<>())
                .build();
    }

    // 3. 폼 검증 에러용 (어디가 틀렸는지 errors 배열 포함)
    public static ErrorResponse of(ErrorCode errorCode, String path, List<FieldErrorDetail> errors) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .errors(errors)
                .build();
    }

    // 유효성 검증(Validation) 에러
    @Getter
    @Builder
    public static class FieldErrorDetail {
        private final String field;   // 예: "email"
        private final String value;   // 예: "wrong-format"
        private final String reason;  // 예: "이메일 형식이 올바르지 않습니다."
    }
}