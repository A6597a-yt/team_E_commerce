package com.team_E_commerce.core.claim.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ClaimCreateRequest(

        // 부분 취소를 위해 여러 개의 주문 상세 ID와 수량을 배열로 받음
        @NotEmpty(message = "취소/환불할 상품을 1개 이상 선택해 주세요.")
        @Valid
        List<ClaimItemDto> claimItems,

        @NotNull(message = "클레임 타입을 선택해 주세요.")
        String claimType, // 에러 메시지 처리를 위해 String으로 받음

        @NotBlank(message = "사유를 상세히 입력해 주세요.")
        String reason,

        // 프론트엔드가 미리 업로드한 사진 주소
        List<String> imageUrls,

        // 무통장 입금 환불용 계좌
        @Valid
        RefundAccountDto refundAccount
) {
    public record RefundAccountDto(
            @NotBlank(message = "은행명을 입력해 주세요.") String bankName,
            @NotBlank(message = "계좌번호를 입력해 주세요.") String accountNumber,
            @NotBlank(message = "예금주를 입력해 주세요.") String accountHolder
    ) {}

    public record ClaimItemDto (
            @NotNull(message = "상품 ID가 누락되었습니다.")
            Long orderLineItemId,

            @NotNull(message = "수량을 입력해 주세요.")
            @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
            Integer quantity
    ) {}
}