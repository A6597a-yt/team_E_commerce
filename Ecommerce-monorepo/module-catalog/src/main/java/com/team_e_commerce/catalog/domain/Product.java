package com.team_e_commerce.catalog.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Builder
    public Product(Long sellerId, Category category, String name, Integer price, String description, ProductStatus status) {
        this.sellerId = sellerId;
        this.category = category;
        this.name = name;
        this.price = price;
        this.description = description;
        // 생성 시 상태를 명시하지 않으면 기본값 SALE
        this.status = status != null ? status : ProductStatus.SALE;
    }
}