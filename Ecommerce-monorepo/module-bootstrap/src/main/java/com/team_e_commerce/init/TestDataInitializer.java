package com.team_e_commerce.init;

import com.team_e_commerce.catalog.category.domain.Category;
import com.team_e_commerce.catalog.category.domain.CategoryRepository;
import com.team_e_commerce.catalog.product.domain.Product;
import com.team_e_commerce.catalog.product.domain.ProductOption;
import com.team_e_commerce.catalog.product.domain.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class TestDataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() == 0) {
            // 1. 카테고리 생성
            Category category = Category.builder()
                    .name("테스트 카테고리")
                    .build();
            categoryRepository.save(category);

            IntStream.rangeClosed(1, 10).forEach(i -> {
                // 2. 상품 생성 (sellerId 필수값 추가, options는 빌더에 없으므로 제외)
                Product product = Product.builder()
                        .sellerId(1L)
                        .category(category)
                        .name("테스트 상품 " + i)
                        .price(10000 + (i * 1000))
                        .description("상세 설명 " + i)
                        .build();

                // 3. 옵션 생성 (stockQuantity, product는 빌더에 없으므로 제외)
                ProductOption option = ProductOption.builder()
                        .optionName("기본 옵션")
                        .additionalPrice(0)
                        .build();

                // 4. 연관관계 매핑 (메서드 내부에서 options.add 및 setProduct 처리됨)
                product.addOption(option);

                // 5. 저장
                productRepository.save(product);
            });
            System.out.println("========== 테스트 데이터 인서트 완료 ==========");
        }
    }
}