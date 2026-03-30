'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getCartListAction, deleteCartItemAction } from '@/features/cart/actions';

// 백엔드 CartResponse DTO에 맞게 필드명 수정 필요
interface CartItem {
    cartItemId: number;
    productId: number;
    productName: string;
    optionName?: string;
    price: number;
    quantity: number;
    thumbnailUrl?: string;
}

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCart = async () => {
            setIsLoading(true);
            const res = await getCartListAction();

            // 1. res.data.items 경로로 배열에 접근
            if (res.success && res.data && res.data.items) {
                // 2. 백엔드에서 안 주는 데이터를 임시로 매핑 (화면 에러 방지)
                const formattedItems = res.data.items.map((item: any, index: number) => ({
                    cartItemId: item.cartItemId || index, // 삭제 기능 작동을 위한 임시 ID
                    productId: item.productId,
                    productName: item.productName || `상품 번호 ${item.productId}`, // 임시 이름
                    price: item.price || 0, // 임시 가격 0원
                    quantity: item.quantity,
                    optionName: item.optionId ? `옵션 ${item.optionId}` : undefined,
                }));
                setCartItems(formattedItems);
            } else {
                setCartItems([]);
                if (!res.success && res.error) alert(res.error);
            }
            setIsLoading(false);
        };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('삭제하시겠습니까?')) return;
        const res = await deleteCartItemAction(id);
        if (res.success) {
            fetchCart();
        } else {
            alert(res.error);
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">장바구니</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Icon icon="solar:cart-cross-broken" className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <p className="text-slate-500">장바구니가 비어있습니다.</p>
                    <Link href="/" className="mt-4 inline-block text-blue-600 font-bold hover:underline">쇼핑 계속하기</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.cartItemId} className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                     {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" /> : <Icon icon="solar:gallery-minimalistic-broken" className="text-slate-400" />}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{item.productName}</h3>
                                            {item.optionName && <p className="text-sm text-slate-500">옵션: {item.optionName}</p>}
                                        </div>
                                        <button onClick={() => handleDelete(item.cartItemId)} className="text-slate-400 hover:text-red-500">
                                            <Icon icon="solar:trash-bin-trash-linear" width={20} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">수량: {item.quantity}개</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit sticky top-24">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">결제 정보</h2>
                        <div className="flex justify-between mb-2 text-slate-600 dark:text-slate-400">
                            <span>상품 금액</span>
                            <span>{totalPrice.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between mb-6 text-slate-600 dark:text-slate-400">
                            <span>배송비</span>
                            <span>무료</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mb-6">
                            <span className="font-bold text-slate-900 dark:text-white">총 결제 금액</span>
                            <span className="text-2xl font-black text-blue-600">{totalPrice.toLocaleString()}원</span>
                        </div>
                        <Link href="/checkout" className="w-full flex justify-center py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                            결제하기
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}