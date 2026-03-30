package com.team_e_commerce.core.order.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderCreateRequest request) {
        // 프론트엔드 파싱 에러를 막기 위해 JSON 형태의 응답을 내려줍니다.
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "주문이 성공적으로 접수되었습니다.");

        return ResponseEntity.ok(response);
    }
}

record OrderCreateRequest(String receiverName, String receiverPhone, String shippingAddress) {}