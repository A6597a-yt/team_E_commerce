package com.team_e_commerce.catalog.product.domain;

import com.team_e_commerce.catalog.category.domain.Category;
import com.team_e_commerce.common.entity.BaseTimeEntity;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 회원(Member) 도메인이 같은 모듈(모듈 2)에 있으나,
    // Aggregate 분리 원칙에 따라 ID만 참조(Soft Reference) 유지
    @Column(nullable = false)
    private Long sellerId; // 타 모듈(회원) 식별자 (Soft Reference)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status; // SALE, SOLD_OUT, HIDDEN

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductOption> options = new ArrayList<>();

    @Builder
    public Product(Long sellerId, Category category, String name, Integer price, String description, String thumbnailUrl, ProductStatus status) {
        this.sellerId = sellerId;
        this.category = category;
        this.name = name;
        this.price = price;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.status = status != null ? status : ProductStatus.ON_SALE;
    }

    public void addOption(ProductOption option) {
        this.options.add(option);
        option.setProduct(this);
    }

    public void updateProduct(String name, Integer price, String description, ProductStatus status) {
        if (price != null && price < 0) {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        if (name != null && !name.isBlank()) this.name = name;
        if (price != null) this.price = price;
        if (description != null) this.description = description;
        if (status != null) this.status = status;
    }
}