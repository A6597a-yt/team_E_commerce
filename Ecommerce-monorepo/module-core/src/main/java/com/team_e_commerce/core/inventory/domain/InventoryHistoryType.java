package com.team_e_commerce.core.inventory.domain;

public enum InventoryHistoryType {
    ALLOCATED, // 주문 버튼 클릭 (점유됨)
    DEDUCTED,  // 결제 완료 (실제 차감됨)
    RESTORED   // 결제 실패/취소 (원복됨)
}