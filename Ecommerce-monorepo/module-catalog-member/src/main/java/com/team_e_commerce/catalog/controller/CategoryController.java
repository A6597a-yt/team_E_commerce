package com.team_e_commerce.catalog.controller;

import com.team_e_commerce.common.response.ApiResponse;
import com.team_e_commerce.catalog.dto.CategoryResponse;
import com.team_e_commerce.catalog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories() {
        List<CategoryResponse> response = categoryService.getCategoryTree();
        return ApiResponse.ok(response);
    }
}