package com.team_e_commerce.core.claim.dto;

import com.team_e_commerce.common.annotation.ValidEnum;
import com.team_e_commerce.core.claim.entity.Claim;
import com.team_e_commerce.core.claim.entity.PaymentMethod;
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

        @ValidEnum(enumClass = Claim.ClaimType.class,
                message = "올바른 클레임 타입(CANCEL, RETURN, EXCHANGE)을 입력해 주세요.")
        String claimType,

        @NotBlank(message = "사유를 입력해 주세요.")
        String reason,

        List<String> imageUrls,

        @NotNull(message = "결제 수단은 필수입니다.")
        PaymentMethod paymentMethod,

        // Facade/Service 계층에서 paymentMethod에 따라 동적으로 검증.
        RefundAccountDto refundAccount,

        // 수거지 주소 (RETURN, EXCHANGE 타입일 경우 Service에서 필수값 검증)
        String returnAddress

) {
    public record ClaimItem(
            @NotNull(message = "주문 상품 ID는 필수입니다.")
            Long orderLineItemId,

            @NotNull(message = "수량은 필수입니다.")
            @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
            Integer quantity
    ) {}

    public record RefundAccountDto(
            @NotBlank(message = "환불 은행명은 필수입니다.")
            String bankName,

            @NotBlank(message = "환불 계좌번호는 필수입니다.")
            String accountNumber,

            @NotBlank(message = "예금주명은 필수입니다.")
            String accountHolder
    ) {}
}