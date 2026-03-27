// 파일 경로: module-catalog-member/src/main/java/com/team_e_commerce/catalog/domain/ProductRepository.java
package com.team_e_commerce.catalog.product.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.options WHERE p.id = :id")
    Optional<Product> findByIdWithOptions(@Param("id") Long id);
}