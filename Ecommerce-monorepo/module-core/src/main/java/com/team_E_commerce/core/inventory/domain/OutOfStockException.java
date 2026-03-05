package com.team_E_commerce.core.inventory.domain;

public class OutOfStockException extends RuntimeException {
    public OutOfStockException(String message) { super(message); }
}
