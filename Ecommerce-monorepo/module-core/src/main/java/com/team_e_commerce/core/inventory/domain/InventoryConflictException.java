package com.team_e_commerce.core.inventory.domain;

// 재도전했는데도 락 충돌을 뚫지 못했을 때 던지는 예외
public class InventoryConflictException extends RuntimeException {
    public InventoryConflictException(String message) { super(message); }
}