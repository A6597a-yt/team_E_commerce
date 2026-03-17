package com.team_e_commerce.catalog.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // 최상위 카테고리만 조회하는 메서드 (트리 구조 시작점)
    List<Category> findByParentIsNull();
}