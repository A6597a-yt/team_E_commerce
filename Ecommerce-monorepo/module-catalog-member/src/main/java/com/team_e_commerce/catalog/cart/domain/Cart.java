package com.team_e_commerce.catalog.cart.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@RedisHash(value = "cart", timeToLive = 604800) // TTL 7일 설정
public class Cart {

    @Id
    private Long memberId;

    private List<CartItem> items = new ArrayList<>();

    public Cart(Long memberId) {
        this.memberId = memberId;
    }

    public void addItem(CartItem newItem) {
        for (CartItem item : items) {
            if (Objects.equals(item.getProductId(), newItem.getProductId()) &&
                    Objects.equals(item.getOptionId(), newItem.getOptionId())) {
                item.addQuantity(newItem.getQuantity());
                return;
            }
        }
        items.add(newItem);
    }

    public void removeItem(Long productId, Long optionId) {
        items.removeIf(item ->
                Objects.equals(item.getProductId(), productId) &&
                        Objects.equals(item.getOptionId(), optionId)
        );
    }

    public void clear() {
        items.clear();
    }
}