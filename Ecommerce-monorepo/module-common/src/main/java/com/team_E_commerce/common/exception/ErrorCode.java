package com.team_E_commerce.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // === [공통 및 인프라 에러] ===
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "올바르지 않은 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "지원하지 않는 HTTP 메서드입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "권한이 없습니다."),

    // === [주문 (Order) 도메인 에러] ===
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문 내역을 찾을 수 없습니다."),
    ORDER_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "주문 상세 정보를 찾을 수 없습니다."),

    // === [클레임 (Claim) 도메인 에러] ===
    ALREADY_CLAIMED(HttpStatus.CONFLICT, "이미 클레임 처리가 진행 중이거나 완료된 상품입니다."),
    EXCEED_CANCELABLE_QUANTITY(HttpStatus.BAD_REQUEST, "취소/환불 가능한 잔여 수량을 초과했습니다."),
    INVALID_CLAIM_STATUS(HttpStatus.BAD_REQUEST, "현재 상태에서는 클레임 처리가 불가능합니다.");
    // REFUND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "환불 처리 중 오류가 발생했습니다."),

    // === [재고 (Inventory) 도메인 에러] ===
    // OUT_OF_STOCK(HttpStatus.CONFLICT, "상품의 재고가 부족합니다."),
    // INVENTORY_RESTORE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "재고 복구 처리 중 오류가 발생했습니다."),

    // === [결제 (Payment) 도메인 에러] ===
    // PAYMENT_FAILED(HttpStatus.BAD_REQUEST, "결제 승인에 실패했습니다."),
    // PAYMENT_AMOUNT_MISMATCH(HttpStatus.BAD_REQUEST, "결제 요청 금액이 실제 주문 금액과 일치하지 않습니다."),

    // === [쿠폰 (Promotion) 도메인 에러] ===
    // COUPON_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않거나 사용 불가능한 쿠폰입니다."),
    // COUPON_ALREADY_USED(HttpStatus.BAD_REQUEST, "이미 사용된 쿠폰입니다."),

    // === [배송 (Delivery) 도메인 에러] ===
    // DELIVERY_NOT_FOUND(HttpStatus.NOT_FOUND, "배송 정보를 찾을 수 없습니다."),
    // ALREADY_SHIPPED(HttpStatus.BAD_REQUEST, "이미 배송이 시작되어 변경이 불가능합니다."),

    // === [상품 (Product) 도메인 에러] ===
    // PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "상품 정보를 찾을 수 없습니다."),
    // CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "카테고리 정보를 찾을 수 없습니다."),

    // === [회원  (Member) 도메인 에러] ===
    // MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다."),
    // DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
    // UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "로그인이 필요한 서비스입니다."),
    // INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 일치하지 않습니다."),
    // INSUFFICIENT_POINTS(HttpStatus.BAD_REQUEST, "보유 포인트가 부족합니다."),

    // === [리뷰 (Review) 도메인 에러] ===
    // REVIEW_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 해당 상품에 대한 리뷰를 작성하셨습니다."),
    // REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "리뷰를 찾을 수 없습니다."),

    // === [장바구니 (Cart) 도메인 에러] ===
    // CART_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "장바구니에 해당 상품이 없습니다."),
    // CART_REDIS_ERROR(HttpStatus.SERVICE_UNAVAILABLE, "장바구니 서비스 이용이 일시적으로 제한됩니다."),

    // === [상담 (CS) 도메인 에러] ===
    // CS_TICKET_NOT_FOUND(HttpStatus.NOT_FOUND, "상담 티켓을 찾을 수 없습니다."),

    // === [알림 (Notification) 도메인 에러] ===
    // MAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "메일 발송에 실패했습니다."),

    // === [관리자 (Backoffice) 도메인 에러] ===
    // NO_ADMIN_PERMISSION(HttpStatus.FORBIDDEN, "관리자 권한이 없습니다."),
    // LOG_WRITE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "활동 이력 기록에 실패했습니다.");

    private final HttpStatus httpStatus;
    private final String description;

    // 커스텀 문자열 코드 대신, Enum의 상수명 자체를 코드로 반환.
    public String getCode() {
        return this.name();
    }
}