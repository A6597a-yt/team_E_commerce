// 파일 경로: module-catalog-member/src/main/java/com/team_e_commerce/catalog/controller/ProductController.java
package com.team_e_commerce.catalog.product.controller;

import com.team_e_commerce.catalog.product.service.ProductService;
import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.catalog.product.dto.ProductCreateRequest;
import com.team_e_commerce.catalog.product.dto.ProductResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(
            @AuthenticationPrincipal Long sellerId,
            @Valid @RequestBody ProductCreateRequest request) {

        ProductResponse response = productService.createProduct(sellerId, request);
        return ApiResponse.ok(response);
    }

    @GetMapping("/{productId}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long productId) {
        ProductResponse response = productService.getProduct(productId);
        return ApiResponse.ok(response);
    }

    @GetMapping("/list")
    public ApiResponse<List<ProductResponse>> getProductList() {
        List<ProductResponse> response = productService.getProductList();
        return ApiResponse.ok(response);
    }
}