// 파일 경로: module-catalog-member/src/main/java/com/team_e_commerce/catalog/service/ProductService.java
package com.team_e_commerce.catalog.product.service;

import com.team_e_commerce.catalog.category.domain.Category;
import com.team_e_commerce.catalog.category.domain.CategoryRepository;

import com.team_e_commerce.catalog.product.domain.Product;
import com.team_e_commerce.catalog.product.domain.ProductOption;
import com.team_e_commerce.catalog.product.domain.ProductRepository;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.catalog.product.dto.ProductCreateRequest;
import com.team_e_commerce.catalog.product.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductResponse createProduct(Long sellerId, ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_INPUT_VALUE));

        Product product = Product.builder()
                .sellerId(sellerId)
                .category(category)
                .name(request.name())
                .price(request.price())
                .description(request.description())
                .build();

        if (request.options() != null && !request.options().isEmpty()) {
            for (ProductCreateRequest.ProductOptionRequest optionReq : request.options()) {
                ProductOption option = ProductOption.builder()
                        .optionName(optionReq.optionName())
                        .additionalPrice(optionReq.additionalPrice())
                        .build();
                product.addOption(option);
            }
        }

        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findByIdWithOptions(productId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        return ProductResponse.from(product);
    }
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductList() {
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .toList();
    }

}