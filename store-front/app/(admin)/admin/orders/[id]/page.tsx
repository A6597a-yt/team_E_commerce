"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// 타입 정의 확장 (상태 4가지로 세분화 및 사유 분리)
interface OrderItem {
    id: number;
    name: string;
    option: string;
    price: number;
    quantity: number;
    status: 'NORMAL' | 'CANCEL_REQUESTED' | 'CANCELED' | 'REJECTED';
    customerCancelReason?: string; // 고객이 입력한 취소 사유
    adminCancelReason?: string;    // 관리자 직권 취소 시 입력하는 사유
}

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
    // --- 상태 관리 ---
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [shippingFee, setShippingFee] = useState(3000);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [courier, setCourier] = useState('우체국택배');
    const [orderStatus, setOrderStatus] = useState('PAID');

    // API 호출 뼈대 (더미 데이터 세팅 - 취소 요청건 포함)
    useEffect(() => {
        setOrder({
            id: params.id,
            orderNumber: 'ORD-20260328-001',
            orderDate: '2026-03-28 14:30',
            customer: { name: '홍길동', phone: '010-1234-5678', address: '인천광역시 연수구 송도동 123-45', memo: '문 앞에 놓아주세요.' },
            payment: { method: '신용카드', status: 'SUCCESS' }
        });
        setItems([
            { id: 101, name: '고성능 전동건 M4A1', option: '블랙 / 기본', price: 450000, quantity: 1, status: 'CANCEL_REQUESTED', customerCancelReason: '단순 변심 (생각보다 무거움)' },
            { id: 102, name: '전술 방탄 조끼', option: '멀티캠 / L', price: 85000, quantity: 1, status: 'NORMAL' },
            { id: 103, name: '비비탄 0.2g (5000발)', option: '단일옵션', price: 12000, quantity: 2, status: 'NORMAL' }
        ]);
    }, [params.id]);

    // --- 이벤트 핸들러 ---

    // 1. 고객 취소 요청 승인 (사유 입력 없이 즉시 처리)
    const handleApproveCancel = (itemId: number) => {
        if (confirm("해당 상품의 취소를 승인하시겠습니까? (결제 금액이 재계산됩니다)")) {
            setItems(prev => prev.map(item =>
                item.id === itemId ? { ...item, status: 'CANCELED' } : item
            ));
        }
    };

    // 2. 고객 취소 요청 반려 (사유 입력 없이 상태만 변경)
    const handleRejectCancel = (itemId: number) => {
        if (confirm("취소 요청을 반려하시겠습니까?")) {
            setItems(prev => prev.map(item =>
                item.id === itemId ? { ...item, status: 'REJECTED' } : item
            ));
        }
    };

    // 3. 관리자 직권 취소 (일반 상품 목록에서 강제 취소 시 사유 입력)
    const handleAdminForceCancel = (itemId: number) => {
        const reason = prompt("관리자 직권 취소 사유를 입력해주세요.\n(예: 재고 부족, 불량품 등)");
        if (reason) {
            setItems(prev => prev.map(item =>
                item.id === itemId ? { ...item, status: 'CANCELED', adminCancelReason: reason } : item
            ));
        }
    };

    const handleShippingFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setShippingFee(value);
    };

    const handleSaveTracking = () => {
        if (!trackingNumber) {
            alert("운송장 번호를 입력해주세요.");
            return;
        }
        alert(`${courier} [${trackingNumber}] 저장 완료!`);
        setOrderStatus('SHIPPING');
    };

    // --- 금액 계산 로직 ---
    // 취소가 확정된(CANCELED) 상품을 제외한 나머지(NORMAL, REQUESTED, REJECTED) 합산
    const subTotal = items.filter(i => i.status !== 'CANCELED').reduce((acc, cur) => acc + (cur.price * cur.quantity), 0);
    const totalAmount = subTotal + shippingFee;

    // 렌더링을 위한 리스트 분리
    const requestedItems = items.filter(i => i.status === 'CANCEL_REQUESTED');
    const normalItems = items.filter(i => i.status !== 'CANCEL_REQUESTED');

    if (!order) return <div className="p-8 text-center text-slate-500">주문 데이터를 불러오는 중...</div>;

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 md:p-8 print:p-0 print:bg-white">

            {/* 1. 상단 헤더 (기존 로직 유지) */}
            <div className="flex justify-between items-center print:hidden mb-2">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon icon="solar:alt-arrow-left-line-duotone" width={24} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                            주문 상세 내역
                            <span className="text-primary bg-primary/10 px-3 py-1 rounded-lg text-lg font-bold">#{order.orderNumber}</span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">주문일시: {order.orderDate}</p>
                    </div>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <Icon icon="solar:printer-line-duotone" width={20} />
                    거래명세서 인쇄
                </button>
            </div>

            {/* 인쇄 전용 타이틀 */}
            <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold">거래명세서</h1>
                <p className="mt-2 text-sm">주문번호: {order.orderNumber} | 주문일자: {order.orderDate}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 좌측: 메인 정보 (상품 및 배송지) */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* 🚨 섹션 A: 취소/환불 요청 대기열 (요청이 있을 때만 렌더링) */}
                    {requestedItems.length > 0 && (
                        <CardBox className="p-0 overflow-hidden border-red-200 dark:border-red-900 shadow-sm print:hidden">
                            <div className="p-5 border-b border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/20">
                                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <Icon icon="solar:danger-triangle-line-duotone" width={22} />
                                    취소/환불 요청 처리 대기열 ({requestedItems.length}건)
                                </h3>
                            </div>
                            <div className="p-5">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                                            <th className="pb-3 font-semibold">상품 및 요청사유</th>
                                            <th className="pb-3 font-semibold text-center w-20">수량</th>
                                            <th className="pb-3 font-semibold text-right w-32">상품금액</th>
                                            <th className="pb-3 font-semibold text-center w-36">승인/반려 처리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestedItems.map(item => (
                                            <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                                                <td className="py-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                                                    <div className="text-sm text-slate-500 mt-1 mb-2">옵션: {item.option}</div>
                                                    <div className="text-xs font-medium text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-100 inline-block">
                                                        고객 요청사유: {item.customerCancelReason}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {item.quantity}개
                                                </td>
                                                <td className="py-4 text-right font-bold text-slate-900 dark:text-white">
                                                    {(item.price * item.quantity).toLocaleString()}원
                                                </td>
                                                <td className="py-4 text-center">
                                                    <div className="flex flex-col gap-1.5 justify-center items-center">
                                                        <button onClick={() => handleApproveCancel(item.id)} className="w-full text-xs bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md font-semibold transition-colors">
                                                            취소 승인
                                                        </button>
                                                        <button onClick={() => handleRejectCancel(item.id)} className="w-full text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md font-semibold transition-colors border border-slate-200">
                                                            요청 반려
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardBox>
                    )}

                    {/* 📦 섹션 B: 일반 결제 상품 목록 */}
                    <CardBox className="p-0 overflow-hidden print:border-none print:shadow-none">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Icon icon="solar:box-minimalistic-line-duotone" className="text-primary" width={22} />
                                주문 상품 목록
                            </h3>
                        </div>
                        <div className="p-5">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                                        <th className="pb-3 font-semibold">상품정보</th>
                                        <th className="pb-3 font-semibold text-center w-20">수량</th>
                                        <th className="pb-3 font-semibold text-right w-32">상품금액</th>
                                        <th className="pb-3 font-semibold text-center w-28 print:hidden">상태/관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {normalItems.map(item => (
                                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                                            <td className="py-4">
                                                <div className={`font-bold text-slate-900 dark:text-white ${item.status === 'CANCELED' ? 'line-through text-slate-400' : ''}`}>
                                                    {item.name}
                                                </div>
                                                <div className="text-sm text-slate-500 mt-1">옵션: {item.option}</div>
                                                {/* 관리자 직권 취소 사유 노출 */}
                                                {item.status === 'CANCELED' && item.adminCancelReason && (
                                                    <div className="mt-2 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 inline-block print:hidden">
                                                        강제 취소됨: {item.adminCancelReason}
                                                    </div>
                                                )}
                                                {/* 취소 승인 완료 사유 (고객 사유) 노출 */}
                                                {item.status === 'CANCELED' && item.customerCancelReason && !item.adminCancelReason && (
                                                    <div className="mt-2 text-xs text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100 inline-block print:hidden">
                                                        취소 완료됨: {item.customerCancelReason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className={`py-4 text-center text-sm font-medium ${item.status === 'CANCELED' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {item.quantity}개
                                            </td>
                                            <td className={`py-4 text-right font-bold ${item.status === 'CANCELED' ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                                {(item.price * item.quantity).toLocaleString()}원
                                            </td>
                                            <td className="py-4 text-center print:hidden">
                                                {item.status === 'NORMAL' && (
                                                    <button onClick={() => handleAdminForceCancel(item.id)} className="text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md font-semibold transition-colors border border-slate-200">
                                                        직권 취소
                                                    </button>
                                                )}
                                                {item.status === 'REJECTED' && (
                                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">반려됨</span>
                                                )}
                                                {item.status === 'CANCELED' && (
                                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md">취소완료</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {normalItems.length === 0 && (
                                        <tr><td colSpan={4} className="py-4 text-center text-sm text-slate-500">모든 상품이 취소/환불 대기 중입니다.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBox>

                    {/* 배송지 및 주문자 정보 (기존 로직 유지) */}
                    <CardBox className="print:border-none print:shadow-none print:p-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                            <Icon icon="solar:user-id-line-duotone" className="text-primary" width={22} />
                            배송지 정보
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 font-medium">수령인 (주문자)</span>
                                <span className="font-bold text-slate-900 dark:text-white text-base">{order.customer.name}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 font-medium">연락처</span>
                                <span className="font-bold text-slate-900 dark:text-white text-base">{order.customer.phone}</span>
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <span className="text-slate-500 font-medium">배송지 주소</span>
                                <span className="font-bold text-slate-900 dark:text-white text-base">{order.customer.address}</span>
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <span className="text-slate-500 font-medium">배송 요청사항</span>
                                <span className="text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                    {order.customer.memo}
                                </span>
                            </div>
                        </div>
                    </CardBox>
                </div>

                {/* 우측: 결제 요약 및 상태 관리 (기존 로직 유지) */}
                <div className="lg:col-span-1 flex flex-col gap-8">

                    <CardBox className="print:hidden bg-slate-50/50 dark:bg-slate-900 border-primary/20">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">주문 상태 관리</h3>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">현재 주문 상태</label>
                                <select
                                    value={orderStatus}
                                    onChange={(e) => setOrderStatus(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary font-bold bg-white dark:bg-slate-800"
                                >
                                    <option value="PAID">결제 완료</option>
                                    <option value="PREPARING">배송 준비중</option>
                                    <option value="SHIPPING">배송중</option>
                                    <option value="DELIVERED">배송 완료</option>
                                    <option value="CANCELED">주문 취소</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">운송장 등록</label>
                                <div className="flex flex-col gap-2">
                                    <select
                                        value={courier}
                                        onChange={(e) => setCourier(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-slate-800"
                                    >
                                        <option value="우체국택배">우체국택배</option>
                                        <option value="CJ대한통운">CJ대한통운</option>
                                        <option value="로젠택배">로젠택배</option>
                                        <option value="한진택배">한진택배</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="송장번호 입력"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-slate-800"
                                        />
                                        <button
                                            onClick={handleSaveTracking}
                                            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                                        >
                                            저장
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBox>

                    {/* 결제 금액 요약 (기존 로직 유지) */}
                    <CardBox className="print:border-none print:shadow-none print:p-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                            <Icon icon="solar:wallet-money-line-duotone" className="text-primary" width={22} />
                            결제 금액 정보
                        </h3>

                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">총 상품 금액</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">{subTotal.toLocaleString()}원</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">배송비 (수동조절)</span>
                                <div className="flex items-center gap-1 print:hidden">
                                    <input
                                        type="number"
                                        value={shippingFee}
                                        onChange={handleShippingFeeChange}
                                        className="w-24 px-2 py-1 text-right text-sm border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:border-primary bg-white dark:bg-slate-800 font-bold"
                                    />
                                    <span className="text-slate-700 dark:text-slate-300 font-bold">원</span>
                                </div>
                                <span className="hidden print:inline font-bold text-slate-700">{shippingFee.toLocaleString()}원</span>
                            </div>

                            <div className="my-2 border-t border-slate-200 dark:border-slate-700 border-dashed"></div>

                            <div className="flex justify-between items-end">
                                <span className="text-slate-800 dark:text-white font-bold text-base">최종 결제 금액</span>
                                <div className="text-right">
                                    <span className="text-2xl font-extrabold text-primary">{totalAmount.toLocaleString()}원</span>
                                    <div className="text-xs text-slate-500 mt-1 font-medium">{order.payment.method} 결제완료</div>
                                </div>
                            </div>
                        </div>
                    </CardBox>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;