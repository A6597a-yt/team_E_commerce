package com.team_e_commerce.catalog.product.domain;

import com.team_e_commerce.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductOption extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String optionName;

    @Column(nullable = false)
    private Integer additionalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    @Builder
    public ProductOption(String optionName, Integer additionalPrice, ProductStatus status) {
        this.optionName = optionName;
        this.additionalPrice = additionalPrice != null ? additionalPrice : 0;
        this.status = status != null ? status : ProductStatus.ON_SALE;
    }

    protected void setProduct(Product product) {
        this.product = product;
    }

    public void updateOption(String optionName, Integer additionalPrice, ProductStatus status) {
        if (optionName != null && !optionName.isBlank()) this.optionName = optionName;
        if (additionalPrice != null) this.additionalPrice = additionalPrice;
        if (status != null) this.status = status;
    }
}