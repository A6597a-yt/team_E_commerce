package com.team_E_commerce.common.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiResponse<T> {

    private final int status;    // HTTP 상태 코드 (200, 201 등)
    private final String message; // 프론트엔드 노출용 메시지
    private final T data;        // 실제 데이터 (단일 DTO 또는 PageResponse)

    // 1. 기본 성공 (200 OK)
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "성공적으로 처리되었습니다.", data);
    }

    // 2. 커스텀 메시지를 포함한 성공 (200 OK)
    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    // 3. 자원 생성 성공 (201 Created)
    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(201, "성공적으로 생성되었습니다.", data);
    }

    // 4. 반환할 데이터가 없는 성공 (예: 단순 삭제 완료)
    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(200, "성공적으로 처리되었습니다.", null);
    }
}