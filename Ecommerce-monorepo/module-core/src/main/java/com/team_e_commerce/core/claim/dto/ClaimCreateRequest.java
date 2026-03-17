package com.team_e_commerce.core.claim.dto;

import com.team_e_commerce.common.annotation.ValidEnum;
import com.team_e_commerce.core.claim.domain.Claim;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClaimCreateRequest(

        @Valid
        @NotNull(message = "클레임 대상 상품은 필수입니다.")
        @Size(min = 1, message = "최소 1개 이상의 상품을 선택해야 합니다.")
        List<ClaimItem> claimItems,

        // String으로 받고 커스텀 어노테이션으로 검증합니다.
        @ValidEnum(enumClass = Claim.ClaimType.class, message = "올바른 클레임 타입(CANCEL, RETURN, EXCHANGE)을 입력해 주세요.")
        String claimType,

        @NotBlank(message = "사유를 입력해 주세요.")
        String reason,

        List<String> imageUrls,

        @Valid // ★ 추가: 내부 필드 검증을 활성화합니다.
        RefundAccountDto refundAccount
) {
    public record ClaimItem(
            @NotNull(message = "주문 상품 ID는 필수입니다.")
            Long orderLineItemId,

            @NotNull(message = "수량은 필수입니다.")
            @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
            Integer quantity
    ) {}

    public record RefundAccountDto(
            // ★ 추가: 객체가 넘어왔다면, 내부 필드는 비어있으면 안 됩니다.
            @NotBlank(message = "환불 은행명은 필수입니다.")
            String bankName,

            @NotBlank(message = "환불 계좌번호는 필수입니다.")
            String accountNumber,

            @NotBlank(message = "예금주명은 필수입니다.")
            String accountHolder
    ) {}
}