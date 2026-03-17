package com.team_E_commerce.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException; // ★ 추가됨
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. 비즈니스 예외 처리 (도메인 규칙 위반)
    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {
        log.warn("BusinessException: {}", e.getMessage());
        ErrorCode errorCode = e.getErrorCode();

        ErrorResponse response = ErrorResponse.of(errorCode, request.getRequestURI());
        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }

    // 2. DTO @Valid 검증 실패 처리 (객체 필드 에러)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e, HttpServletRequest request) {
        log.warn("MethodArgumentNotValidException: {}", e.getMessage());

        // record 구조에 맞게 생성 로직 수정
        List<ErrorResponse.FieldErrorDetail> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new ErrorResponse.FieldErrorDetail(
                        error.getField(),
                        error.getRejectedValue() == null ? "" : error.getRejectedValue().toString(),
                        error.getDefaultMessage()
                ))
                .toList();

        ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, request.getRequestURI(), errors);
        return ResponseEntity.status(ErrorCode.INVALID_INPUT_VALUE.getHttpStatus()).body(response);
    }

    // 3. 단일 파라미터 (@PathVariable, @RequestParam) 검증 실패 처리
    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException e, HttpServletRequest request) {
        log.warn("ConstraintViolationException: {}", e.getMessage());

        // 어떤 파라미터가 왜 실패했는지 추적
        List<ErrorResponse.FieldErrorDetail> errors = e.getConstraintViolations()
                .stream()
                .map(violation -> new ErrorResponse.FieldErrorDetail(
                        violation.getPropertyPath().toString(), // 위반된 파라미터 경로
                        violation.getInvalidValue() == null ? "" : violation.getInvalidValue().toString(),
                        violation.getMessage()
                ))
                .toList();

        ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, request.getRequestURI(), errors);
        return ResponseEntity.status(ErrorCode.INVALID_INPUT_VALUE.getHttpStatus()).body(response);
    }

    // 4. JSON 파싱 에러 (Enum 타입 불일치 등) 처리
    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e, HttpServletRequest request) {
        log.warn("HttpMessageNotReadableException: {}", e.getMessage());

        String customMessage = "요청 데이터 형식이 올바르지 않거나 허용되지 않는 값(예: 잘못된 타입 지정)이 포함되어 있습니다.";
        ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, customMessage, request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INVALID_INPUT_VALUE.getHttpStatus()).body(response);
    }

    // 5. 그 외 잡아내지 못한 서버 에러 처리
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest request) {
        log.error("Unhandled Exception: ", e);

        ErrorResponse response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR, request.getRequestURI());
        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus()).body(response);
    }
}