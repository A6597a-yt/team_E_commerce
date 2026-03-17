package com.team_E_commerce.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class ErrorResponse {

    private final LocalDateTime timestamp; // 에러 발생 시간
    private final int status;              // HTTP 상태 코드
    private final String code;             // 도메인별 고유 에러 코드
    private final String description;      // 프론트 알림창용 문구
    private final String path;             // 에러가 발생한 API 주소

    // errors가 비어있으면 JSON 응답에서 아예 제외시킴
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<FieldErrorDetail> errors;

    // 1. 단일 비즈니스 에러용
    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .description(errorCode.getDescription())
                .path(path)
                .errors(new ArrayList<>())
                .build();
    }

    // 2. 외부 메시지 주입용 단일 에러
    public static ErrorResponse of(ErrorCode errorCode, String description, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .description(description)
                .path(path)
                .errors(new ArrayList<>())
                .build();
    }

    // 3. 폼 검증 에러용
    public static ErrorResponse of(ErrorCode errorCode, String path, List<FieldErrorDetail> errors) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .description(errorCode.getDescription())
                .path(path)
                .errors(errors)
                .build();
    }

    // 유효성 검증(Validation) 에러 디테일을 record로 깔끔하게 변경
    @Builder
    public record FieldErrorDetail(
            String field,   // 예: "email"
            String value,   // 예: "wrong-format" (거절된 입력값 추적)
            String reason   // 예: "이메일 형식이 올바르지 않습니다."
    ) {}
}