package com.team_E_commerce.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 커스텀 에러들
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {
        log.warn("BusinessException 발생 [{}]: {}", e.getErrorCode().getCode(), e.getMessage());

        ErrorCode errorCode = e.getErrorCode();

        // e.getMessage()를 넘겨서 상세 메시지가 프론트엔드로 전달되게
        ErrorResponse response = ErrorResponse.of(errorCode, e.getMessage(), request.getRequestURI());

        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    // DTO 폼 검증 예외 (@Valid 실패 시)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e, HttpServletRequest request) {
        log.warn("Validation 에러 발생: {}", request.getRequestURI());

        // 여러 개의 입력 에러를 FieldErrorDetail 객체 리스트로 변환
        List<ErrorResponse.FieldErrorDetail> fieldErrors = e.getBindingResult().getFieldErrors().stream()
                .map(error -> ErrorResponse.FieldErrorDetail.builder()
                        .field(error.getField())
                        .value(error.getRejectedValue() == null ? "" : error.getRejectedValue().toString())
                        .reason(error.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        // 공통 에러 코드는 INVALID_INPUT_VALUE 사용
        ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, request.getRequestURI(), fieldErrors);

        return ResponseEntity.status(ErrorCode.INVALID_INPUT_VALUE.getStatus()).body(response);
    }

    // 처리하지 못한 서버 에러 (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception e, HttpServletRequest request) {
        log.error("Unhandled Exception 발생 [{}]: ", request.getRequestURI(), e);

        ErrorResponse response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR, request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus()).body(response);
    }
}