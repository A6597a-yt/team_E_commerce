'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import api from '@/lib/api';

// --- 주문 및 문의 상태 한글 매퍼 (내부 구현) ---
const statusMapper: { [key: string]: { label: string; color: string } } = {
    // 주문 상태
    'PAYMENT_COMPLETED': { label: '결제완료', color: 'text-blue-600 bg-blue-50' },
    'SHIPPING': { label: '배송중', color: 'text-orange-600 bg-orange-50' },
    'DELIVERED': { label: '배송완료', color: 'text-emerald-600 bg-emerald-50' },
    'CANCELLED': { label: '주문취소', color: 'text-red-600 bg-red-50' },
    // 문의 상태
    'WAITING': { label: '답변대기', color: 'text-slate-500 bg-slate-100' },
    'ANSWERED': { label: '답변완료', color: 'text-purple-600 bg-purple-50' },
};

export default function MyDashboardPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 주문 및 문의 내역 병렬 호출
                const [orderRes, inquiryRes] = await Promise.all([
                    api.get('/api/orders/me'),
                    api.get('/api/inquiries'),
                ]);
                setOrders(orderRes.data);
                setInquiries(inquiryRes.data);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="py-20 text-center text-slate-500 font-bold">대시보드 불러오는 중...</div>;

    return (
        <div className="space-y-10">
            {/* 1. 요약 카드 섹션 (주문/문의 수치만) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">전체 주문 건수</p>
                        <h4 className="text-3xl font-black text-slate-900 mt-1">{orders.length}건</h4>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Icon icon="solar:cart-large-minimalistic-bold" width={24} />
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">나의 문의 현황</p>
                        <h4 className="text-3xl font-black text-slate-900 mt-1">{inquiries.length}건</h4>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Icon icon="solar:chat-dot-square-bold" width={24} />
                    </div>
                </div>
            </section>

            {/* 2. 최근 주문 내역 (상위 3개만 잘라서 표시) */}
            <section className="space-y-4">
                <div className="flex justify-between items-end px-2">
                    <h3 className="text-lg font-black text-slate-900">최근 주문 내역</h3>
                    <Link href="/mypage/orders" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">전체보기</Link>
                </div>
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    {orders.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {orders.slice(0, 3).map((order) => (
                                <div key={order.orderId} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-bold text-slate-400">{order.orderDate}</span>
                                        <span className="text-sm font-bold text-slate-800">{order.orderId}</span>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <span className="text-sm font-black text-slate-900">{order.totalAmount.toLocaleString()}원</span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${statusMapper[order.status]?.color || 'bg-slate-100'}`}>
                                            {statusMapper[order.status]?.label || order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400 text-sm">최근 주문 내역이 없습니다.</div>
                    )}
                </div>
            </section>

            {/* 3. 최근 1:1 문의 (상위 2개만 잘라서 표시) */}
            <section className="space-y-4">
                <div className="flex justify-between items-end px-2">
                    <h3 className="text-lg font-black text-slate-900">최근 문의 내역</h3>
                    <Link href="/mypage/inquiry" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">전체보기</Link>
                </div>
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    {inquiries.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {inquiries.slice(0, 2).map((inquiry) => (
                                <div key={inquiry.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-bold text-slate-400">{inquiry.createdAt}</span>
                                        <span className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-xs">{inquiry.title}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${statusMapper[inquiry.status]?.color || 'bg-slate-100'}`}>
                                        {statusMapper[inquiry.status]?.label || inquiry.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400 text-sm">최근 문의 내역이 없습니다.</div>
                    )}
                </div>
            </section>
        </div>
    );
}