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

    private final LocalDateTime timestamp; // 에러 발생 시간 (예: "2026-03-03T18:00:05")
    private final int status;              // HTTP 상태 코드 (예: 400)
    private final String code;             // 도메인별 고유 에러 코드
    private final String message;          // 프론트 알림창용 문구
    private final String path;             // 에러가 발생한 API 주소

    // errors가 비어있으면 JSON에서 아예 빼버리도록 설정 (깔끔한 응답을 위해)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<FieldErrorDetail> errors;

    // 단일 비즈니스 에러용 생성 메서드 (errors 없음)
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

    // 폼 검증 에러용 생성 메서드 (errors 배열 포함)
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

    // 폼 검증 시 어떤 칸이 왜 틀렸는지 담을 내부 클래스
    @Getter
    @Builder
    public static class FieldErrorDetail {
        private final String field;   // 예: "email"
        private final String value;   // 예: "wrong-email-format"
        private final String reason;  // 예: "이메일 형식이 올바르지 않습니다."
    }

    // ErrorCode의 기본 메시지 대신, 외부에서 전달받은 메시지를 세팅
    public static ErrorResponse of(ErrorCode errorCode, String message, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .message(message)
                .path(path)
                .build();
    }
}