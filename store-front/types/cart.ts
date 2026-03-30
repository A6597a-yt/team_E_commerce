export interface CartItem {
    productId: number; // 상품 ID가 장바구니 아이템 ID와 동일
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}