// 파일 경로: module-core/src/main/java/com/team_e_commerce/core/order/domain/OrderRepository.java
package com.team_e_commerce.core.order.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}