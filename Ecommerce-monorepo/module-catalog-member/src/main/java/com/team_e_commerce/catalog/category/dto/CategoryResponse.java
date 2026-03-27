package com.team_e_commerce.catalog.category.dto;


import com.team_e_commerce.catalog.category.domain.Category;

import java.util.List;
import java.util.stream.Collectors;

public record CategoryResponse(
        Long categoryId,
        String name,
        List<CategoryResponse> children
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getChildren().stream()
                        .map(CategoryResponse::from)
                        .collect(Collectors.toList())
        );
    }
}