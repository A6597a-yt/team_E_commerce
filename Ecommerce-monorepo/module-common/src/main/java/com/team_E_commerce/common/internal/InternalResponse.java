package com.team_E_commerce.common.internal;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class InternalResponse<T> {

    private final boolean isSuccess;
    private final String code;
    private final String message;
    private final T data;
    private final String traceId;

    // 통신 성공 시
    public static <T> InternalResponse<T> success(T data, String traceId) {
        return new InternalResponse<>(true, "SUCCESS", "성공적으로 처리되었습니다.", data, traceId);
    }

    // 통신 실패 시
    public static <T> InternalResponse<T> fail(String code, String message, String traceId) {
        return new InternalResponse<>(false, code, message, null, traceId);
    }
}