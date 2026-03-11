package com.team_E_commerce.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j // 로그백(Logback) 로거 활성화
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 프론트엔드의 폼 입력값 검증 실패 (@Valid 에러)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        // 경고 수준의 로그 (서버 잘못이 아니므로 warn)
        log.warn("요청값 검증 실패 - URI: {}, Message: {}", request.getRequestURI(), ex.getMessage());

        // 여러 개의 필드 에러를 수집하여 빌더로 깔끔하게 조립
        List<ErrorResponse.FieldErrorDetail> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> ErrorResponse.FieldErrorDetail.builder()
                        .field(error.getField())
                        .value(error.getRejectedValue() == null ? "null" : error.getRejectedValue().toString())
                        .reason(error.getDefaultMessage())
                        .build()
                )
                .collect(Collectors.toList());

        ErrorResponse errorResponse = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, request.getRequestURI(), fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // 비즈니스 로직 예외 (예: 재고 부족, 권한 없음 등)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex, HttpServletRequest request) {

        // 의도된 비즈니스 거절이므로 warn 로그
        log.warn("비즈니스 예외 발생 - URI: {}, Code: {}", request.getRequestURI(), ex.getErrorCode().getCode());

        ErrorResponse errorResponse = ErrorResponse.of(ex.getErrorCode(), request.getRequestURI());
        return ResponseEntity.status(ex.getErrorCode().getStatus()).body(errorResponse);
    }

    // 서버 내부 에러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(
            Exception ex, HttpServletRequest request) {

        // 서버 버그이므로 즉각적인 알림을 위해 error 로그 + 스택 트레이스 전체 출력
        log.error("서버 내부 치명적 에러 발생! URI: {}", request.getRequestURI(), ex);

        // 프론트엔드에게는 서버 내부 구조(SQL, 패키지 경로)를 절대 노출하지 않고 포장해서 응답
        ErrorResponse errorResponse = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR, request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}