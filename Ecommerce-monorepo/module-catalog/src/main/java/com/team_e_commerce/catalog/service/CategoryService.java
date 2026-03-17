package com.team_e_commerce.catalog.service;

import com.team_e_commerce.catalog.domain.CategoryRepository;
import com.team_e_commerce.catalog.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoryTree() {
        return categoryRepository.findByParentIsNull().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }
}