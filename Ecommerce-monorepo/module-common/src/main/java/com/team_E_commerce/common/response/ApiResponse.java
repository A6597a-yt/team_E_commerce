package com.team_E_commerce.common.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 공통 API 응답 래퍼
 * 성공 시 success: true 같은 불필요한 메타데이터 필드를 넣지 않기로 한 합의를 반영했습니다.
 */
@Getter
public class ApiResponse<T> {

    private final T data;

    private ApiResponse(T data) {
        this.data = data;
    }

    // 단일/페이징 데이터 반환 시 (200 OK)
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data);
    }

    // 데이터가 없는 단순 성공 시 (data 필드 null 처리)
    public static <T> ApiResponse<T> ok() {
        return new ApiResponse<>(null);
    }
}

//@Getter
//@AllArgsConstructor(access = AccessLevel.PRIVATE)
//public class ApiResponse<T> {
//
//    private final int status;    // HTTP 상태 코드 (200, 201 등)
//    private final T data;        // 실제 데이터 (단일 DTO 또는 PageResponse)
//
//    // 1. 기본 성공 (200 OK)
//    public static <T> ApiResponse<T> ok(T data) {
//
//        return new ApiResponse<>(200, data);
//    }
//
//    // 2. 커스텀 메시지를 포함한 성공 (200 OK)
//    public static <T> ApiResponse<T> ok(String message, T data) {
//
//        return new ApiResponse<>(200,  data);
//    }
//
//    // 3. 자원 생성 성공 (201 Created)
//    public static <T> ApiResponse<T> created(T data) {
//
//        return new ApiResponse<>(201,  data);
//    }
//
//    // 4. 반환할 데이터가 없는 성공 (예: 단순 삭제 완료)
//    public static ApiResponse<Void> ok() {
//
//        return new ApiResponse<>(200,  null);
//    }
//}