package com.team_e_commerce.catalog.service;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.catalog.domain.Product;
import com.team_e_commerce.catalog.domain.ProductRepository;
import com.team_e_commerce.catalog.dto.ProductCreateRequest;
import com.team_e_commerce.catalog.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse createProduct(Long sellerId, ProductCreateRequest request) {
        Product product = Product.builder()
                .sellerId(sellerId)
                .name(request.name())
                .price(request.price())
                .description(request.description())
                .build();

        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_INPUT_VALUE)); // 적절한 상품 Not Found 에러 코드로 변경 필요

        return ProductResponse.from(product);
    }
}