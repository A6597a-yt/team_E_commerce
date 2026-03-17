package com.team_e_commerce.catalog.controller;

import com.team_e_commerce.common.annotation.LoginMemberId;
import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.catalog.dto.ProductCreateRequest;
import com.team_e_commerce.catalog.dto.ProductResponse;
import com.team_e_commerce.catalog.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(
            @LoginMemberId Long sellerId,
            @Valid @RequestBody ProductCreateRequest request) {

        ProductResponse response = productService.createProduct(sellerId, request);
        return ApiResponse.ok(response);
    }

    @GetMapping("/{productId}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long productId) {
        ProductResponse response = productService.getProduct(productId);
        return ApiResponse.ok(response);
    }
}