'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import api from '@/lib/api';

const statusMapper: { [key: string]: { label: string; color: string } } = {
    'PAYMENT_COMPLETED': { label: '결제완료', color: 'text-blue-600 bg-blue-50' },
    'SHIPPING': { label: '배송중', color: 'text-orange-600 bg-orange-50' },
    'DELIVERED': { label: '배송완료', color: 'text-emerald-600 bg-emerald-50' },
    'CANCELLED': { label: '주문취소', color: 'text-red-600 bg-red-50' },
};

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/api/orders/me').then(res => {
            setOrders(res.data);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <div className="py-20 text-center text-slate-400">주문 내역 로드 중...</div>;

    return (
        <div className="space-y-6">
            <div className="px-2">
                <h2 className="text-2xl font-black text-slate-900">주문 내역</h2>
                <p className="text-sm text-slate-500 mt-1">고객님이 주문하신 전체 내역입니다.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                {orders.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {orders.map((order) => (
                            <div key={order.orderId} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400">{order.orderDate}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${statusMapper[order.status]?.color}`}>
                                            {statusMapper[order.status]?.label}
                                        </span>
                                    </div>
                                    <span className="text-base font-bold text-slate-800">{order.orderId}</span>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <span className="text-lg font-black text-slate-900">{order.totalAmount.toLocaleString()}원</span>
                                    <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-white transition-all shadow-sm">
                                        상세보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-400">주문 내역이 없습니다.</div>
                )}
            </div>
        </div>
    );
}