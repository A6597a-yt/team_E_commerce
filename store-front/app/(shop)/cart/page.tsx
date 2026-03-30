'use client';

import { useState, useEffect, useMemo } from 'react';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';
import { CartItem } from '@/types/cart';

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. 장바구니 데이터 로드
    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('장바구니 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. 수량 변경 핸들러
    const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch('/api/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            });

            if (response.ok) {
                setItems((prev) =>
                    prev.map((item) =>
                        item.productId === productId ? { ...item, quantity: newQuantity } : item
                    )
                );
            }
        } catch (error) {
            alert('수량 변경에 실패했습니다.');
        }
    };

    // 3. 상품 삭제 핸들러
    const handleDelete = async (productId: number) => {
        if (!confirm('장바구니에서 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/cart?productId=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setItems((prev) => prev.filter((item) => item.productId !== productId));
            }
        } catch (error) {
            alert('상품 삭제에 실패했습니다.');
        }
    };

    // 4. 금액 계산 (useMemo 활용)
    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    if (isLoading) return <div className="p-20 text-center">장바구니를 불러오는 중...</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-8">장바구니</h1>

            {items.length === 0 ? (
                <div className="text-center py-20 border-t">
                    <p className="text-gray-500">장바구니에 담긴 상품이 없습니다.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 장바구니 목록 리스트 */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <CartItemRow
                                key={item.productId}
                                item={item}
                                onUpdate={handleUpdateQuantity}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* 결제 요약 섹션 */}
                    <div className="lg:col-span-1">
                        <CartSummary totalPrice={totalPrice} />
                    </div>
                </div>
            )}
        </div>
    );
}