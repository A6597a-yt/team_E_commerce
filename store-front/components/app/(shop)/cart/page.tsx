'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CartItemRow from '@/components/cart/CartItemRow';
import CartSummary from '@/components/cart/CartSummary';
import { CartItem } from '@/types/cart';
import api from '@/lib/api';

export default function CartPage() {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    // 1. 장바구니 데이터 로드
    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            // ✅ 수정된 부분: fetch -> api.get
            const response = await api.get('/api/cart');
            setItems(response.data);
            setSelectedItemIds(response.data.map((item: CartItem) => item.productId));
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
            await api.patch('/api/cart', { productId, quantity: newQuantity });

            setItems((prev) =>
                prev.map((item) =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            alert('수량 변경에 실패했습니다.');
        }
    };

    // 3. 상품 삭제 핸들러
    const handleDelete = async (productId: number) => {
        if (!confirm('장바구니에서 삭제하시겠습니까?')) return;

        try {
            // ✅ 수정된 부분: fetch -> api.delete
            await api.delete('/api/cart', { params: { productId } });

            setItems((prev) => prev.filter((item) => item.productId !== productId));
            setSelectedItemIds((prev) => prev.filter((id) => id !== productId));
        } catch (error) {
            alert('상품 삭제에 실패했습니다.');
        }
    };

    // 4. 개별 상품 체크박스 토글
    const handleToggleSelect = (productId: number) => {
        setSelectedItemIds((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    // 5. 전체 선택 토글
    const handleToggleSelectAll = () => {
        if (selectedItemIds.length === items.length) {
            setSelectedItemIds([]); // 모두 해제
        } else {
            setSelectedItemIds(items.map((item) => item.productId)); // 모두 선택
        }
    };

    // 6. 금액 계산 (선택된 상품만 포함)
    const totalPrice = useMemo(() => {
        return items
            .filter((item) => selectedItemIds.includes(item.productId))
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items, selectedItemIds]);

    // 7. 주문 페이지 이동
    const handleCheckout = () => {
        if (selectedItemIds.length === 0) {
            alert('결제할 상품을 선택해주세요.');
            return;
        }
        const query = selectedItemIds.join(',');
        router.push(`/order/checkout?items=${query}`);
    };

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
                    <div className="lg:col-span-2 space-y-4">

                        {/* 전체 선택 UI */}
                        <div className="flex items-center pb-2 border-b">
                            <input
                                type="checkbox"
                                checked={selectedItemIds.length === items.length && items.length > 0}
                                onChange={handleToggleSelectAll}
                                className="w-5 h-5 mr-3 cursor-pointer"
                            />
                            <span className="font-semibold">전체 선택 ({selectedItemIds.length}/{items.length})</span>
                        </div>

                        {/* 개별 장바구니 아이템 리스트 */}
                        {items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-3">
                                {/* CartItemRow 수정 없이 바깥에서 체크박스를 렌더링 */}
                                <input
                                    type="checkbox"
                                    checked={selectedItemIds.includes(item.productId)}
                                    onChange={() => handleToggleSelect(item.productId)}
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <CartItemRow
                                        item={item}
                                        onUpdate={handleUpdateQuantity}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 결제 요약 섹션 */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            totalPrice={totalPrice}
                            onCheckout={handleCheckout}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}