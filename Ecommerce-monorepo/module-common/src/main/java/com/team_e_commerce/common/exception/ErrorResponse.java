package com.team_e_commerce.common.exception;

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
    private final String code;             // 에러 식별자 (Enum name)
    private final String description;      // 프론트 알림창용 문구
    private final String path;             // 에러가 발생한 API 주소

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<FieldErrorDetail> errors;

    // 1. 기본 비즈니스 예외 응답 (ErrorCode의 기본 description 사용)
    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.name())
                .description(errorCode.getDescription())
                .path(path)
                .errors(new ArrayList<>())
                .build();
    }

    // 2. 외부에서 메시지를 직접 주입하는 경우 (예: GlobalExceptionHandler의 예외 메시지 커스텀)
    public static ErrorResponse of(ErrorCode errorCode, String description, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.name())
                .description(description)
                .path(path)
                .errors(new ArrayList<>())
                .build();
    }

    // 3. 유효성 검증(Validation) 에러용 응답
    public static ErrorResponse of(ErrorCode errorCode, String path, List<FieldErrorDetail> errors) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.name())
                .description(errorCode.getDescription())
                .path(path)
                .errors(errors)
                .build();
    }

    @Builder
    public record FieldErrorDetail(
            String field,   // 예: "email"
            String value,   // 예: "wrong-format"
            String reason   // 예: "이메일 형식이 올바르지 않습니다."
    ) {}

}