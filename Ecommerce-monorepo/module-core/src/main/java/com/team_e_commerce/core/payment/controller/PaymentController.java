package com.team_e_commerce.core.payment.controller;

import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.core.payment.entity.Payment;
import com.team_e_commerce.core.payment.dto.PaymentCancelRequest;
import com.team_e_commerce.core.payment.dto.PaymentRequest;
import com.team_e_commerce.core.payment.dto.PaymentResponse;
import com.team_e_commerce.core.payment.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 결제 요청 API
     */
    @PostMapping
    public ApiResponse<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        Payment payment = paymentService.processPayment(
                request.orderId(),
                request.memberId(),
                request.amount(),
                request.paymentMethod()
        );

        return ApiResponse.ok(PaymentResponse.from(payment));
    }

    // 결제 취소 요청
    @PostMapping("/{paymentId}/cancel")
    public ApiResponse<PaymentResponse> cancelPayment(
            @PathVariable Long paymentId,
            @Valid @RequestBody PaymentCancelRequest request) {

        Payment payment = paymentService.cancelPayment(
                request.orderId(),
                paymentId,
                request.cancelAmount()
        );

        return ApiResponse.ok(PaymentResponse.from(payment));
    }
}