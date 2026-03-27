package com.team_e_commerce.catalog.cart.infrastructure;

import com.team_e_commerce.catalog.cart.domain.Cart;
import org.springframework.data.repository.CrudRepository;

public interface CartRedisRepository extends CrudRepository<Cart, Long> {
}