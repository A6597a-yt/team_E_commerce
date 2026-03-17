package com.team_E_commerce.common.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class MaskingUtils {

    public static String maskAccountNumber(String account) {
        if (account == null || account.isBlank()) return account;

        int len = account.length();

        if (len <= 2) {
            return "*".repeat(len);
        }
        if (len <= 6) {
            return account.substring(0, 1) + "*".repeat(len - 2) + account.substring(len - 1);
        }
        return account.substring(0, 3) + "*".repeat(len - 6) + account.substring(len - 3);
    }

    // 추후 휴대폰 번호, 이름 마스킹 등을 여기에 추가하여 확장 가능
}