"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// 주문 데이터 타입 정의 (Spring Boot DTO에 맞춰 추후 수정 가능)
interface Order {
    id: number;
    orderNumber: string;
    orderDate: string;
    customerName: string;
    productSummary: string;
    totalAmount: number;
    paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
    orderStatus: 'PAYMENT_WAITING' | 'PAID' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELED';
}

const OrderManagementPage = () => {
    // --- 상태 관리 ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 필터 및 페이징 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('1month');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // --- API 호출 로직 (Spring Boot Page<T> 연동 뼈대) ---
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                // API 호출 주석 처리
                // const queryParams = new URLSearchParams({ page: currentPage.toString(), size: '20', status: statusFilter, keyword: searchQuery });
                // const response = await fetch(`/api/admin/orders?${queryParams}`);
                // const data = await response.json();
                // setOrders(data.content);
                // setTotalPages(data.totalPages);

                // UI 확인용 더미 데이터
                setTimeout(() => {
                    setOrders([
                        { id: 1, orderNumber: 'ORD-20260328-001', orderDate: '2026-03-28 14:30', customerName: '홍길동', productSummary: '고성능 전동건 M4A1 외 1건', totalAmount: 485000, paymentStatus: 'SUCCESS', orderStatus: 'PAID' },
                        { id: 2, orderNumber: 'ORD-20260328-002', orderDate: '2026-03-28 11:15', customerName: '김철수', productSummary: '전술 방탄 조끼', totalAmount: 85000, paymentStatus: 'PENDING', orderStatus: 'PAYMENT_WAITING' },
                        { id: 3, orderNumber: 'ORD-20260327-003', orderDate: '2026-03-27 19:40', customerName: '이영희', productSummary: '1/144 건담 프라모델', totalAmount: 32000, paymentStatus: 'SUCCESS', orderStatus: 'SHIPPING' },
                        { id: 4, orderNumber: 'ORD-20260327-004', orderDate: '2026-03-27 09:20', customerName: '박지성', productSummary: '가스건 (GBB) 추가탄창', totalAmount: 45000, paymentStatus: 'FAILED', orderStatus: 'CANCELED' },
                    ]);
                    setTotalPages(5);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error("주문 목록을 불러오는 데 실패했습니다.", error);
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [currentPage, statusFilter, dateFilter]);

    // --- 이벤트 핸들러 ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(orders.map(o => o.id));
        else setSelectedIds([]);
    };

    const handleSelectItem = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    // 주문 상태 즉시 변경 로직
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        if (confirm('주문 상태를 변경하시겠습니까?')) {
            // API 호출 로직 뼈대
            // await fetch(`/api/admin/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, orderStatus: newStatus as any } : order));
        }
    };

    // 엑셀 다운로드 로직
    const handleExcelDownload = () => {
        if (selectedIds.length === 0) {
            alert("다운로드할 주문을 선택해주세요.");
            return;
        }
        console.log("엑셀 다운로드 요청 ID:", selectedIds);
        alert(`${selectedIds.length}건의 주문 내역을 엑셀로 다운로드합니다. (API 연동 필요)`);
        // window.location.href = `/api/admin/orders/excel?ids=${selectedIds.join(',')}`;
    };

    return (
        <div className="flex flex-col gap-6 max-w-full mx-auto p-4 md:p-6">
            {/* 1. 상단 헤더 및 요약 위젯 */}
            <div className="mb-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">주문 목록</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 mt-2">고객의 주문 내역을 확인하고 배송 및 결제 상태를 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {[
                    { title: '신규 주문 (결제완료)', count: 12, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { title: '배송 준비중', count: 8, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { title: '배송중', count: 24, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { title: '취소/환불 요청', count: 2, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
                ].map((stat, idx) => (
                    <CardBox key={idx} className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.title}</p>
                            <h4 className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.count}건</h4>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <Icon icon="solar:box-minimalistic-line-duotone" className={stat.color} width={24} />
                        </div>
                    </CardBox>
                ))}
            </div>

            <CardBox className="p-6">
                {/* 2. 툴바 영역 (엑셀 다운로드, 필터, 검색) */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            총 {selectedIds.length}건 선택됨
                        </span>
                        <button
                            onClick={handleExcelDownload}
                            className="flex items-center gap-2 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-lg font-semibold transition-colors dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
                        >
                            <Icon icon="solar:document-text-line-duotone" width={18} />
                            엑셀 다운로드
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <select
                            value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(0); }}
                            className="py-2 pl-3 pr-8 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary shadow-inner bg-white dark:bg-slate-900 dark:text-white"
                        >
                            <option value="today">오늘</option>
                            <option value="1week">최근 1주일</option>
                            <option value="1month">최근 1개월</option>
                            <option value="all">전체 기간</option>
                        </select>

                        <select
                            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                            className="py-2 pl-3 pr-8 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary shadow-inner bg-white dark:bg-slate-900 dark:text-white"
                        >
                            <option value="ALL">주문 상태 전체</option>
                            <option value="PAYMENT_WAITING">결제 대기</option>
                            <option value="PAID">결제 완료</option>
                            <option value="PREPARING">배송 준비중</option>
                            <option value="SHIPPING">배송중</option>
                            <option value="DELIVERED">배송 완료</option>
                        </select>

                        <div className="relative flex-1 lg:w-64">
                            <Icon icon="solar:magnifer-line-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width={18} />
                            <input
                                type="text" placeholder="주문번호, 주문자명 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary shadow-inner bg-white dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. 주문 목록 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                <th className="p-4 w-12 text-center">
                                    <input type="checkbox" checked={orders.length > 0 && selectedIds.length === orders.length} onChange={handleSelectAll} className="rounded border-slate-300 text-primary focus:ring-primary" />
                                </th>
                                <th className="p-4">주문일시 / 주문번호</th>
                                <th className="p-4">주문자명</th>
                                <th className="p-4">상품정보</th>
                                <th className="p-4 text-right">결제금액</th>
                                <th className="p-4 text-center">결제상태</th>
                                <th className="p-4 text-center">주문상태 (변경)</th>
                                <th className="p-4 text-center">상세</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8} className="p-8 text-center text-slate-500">데이터를 불러오는 중입니다...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={8} className="p-8 text-center text-slate-500">조회된 주문 내역이 없습니다.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => handleSelectItem(order.id)} className="rounded border-slate-300 text-primary focus:ring-primary" />
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{order.orderDate}</div>
                                            <div className="font-semibold text-slate-800 dark:text-white">{order.orderNumber}</div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{order.customerName}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px]" title={order.productSummary}>{order.productSummary}</td>
                                        <td className="p-4 text-sm font-bold text-right text-slate-900 dark:text-white">{order.totalAmount.toLocaleString()}원</td>
                                        <td className="p-4 text-center">
                                            {order.paymentStatus === 'SUCCESS' && <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">결제완료</span>}
                                            {order.paymentStatus === 'PENDING' && <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600">결제대기</span>}
                                            {order.paymentStatus === 'FAILED' && <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-700">결제실패</span>}
                                            {order.paymentStatus === 'REFUNDED' && <span className="px-2.5 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">환불완료</span>}
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* 상태 즉시 변경 셀렉트 박스 */}
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`py-1.5 pl-3 pr-8 text-xs font-semibold border rounded-md focus:outline-none focus:ring-1 
                          ${order.orderStatus === 'PAID' ? 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500' : ''}
                          ${order.orderStatus === 'PREPARING' ? 'bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500' : ''}
                          ${order.orderStatus === 'SHIPPING' || order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500' : ''}
                          ${order.orderStatus === 'CANCELED' ? 'bg-slate-50 border-slate-200 text-slate-500 focus:ring-slate-500' : ''}
                          ${order.orderStatus === 'PAYMENT_WAITING' ? 'bg-white border-slate-200 text-slate-700' : ''}
                        `}
                                            >
                                                <option value="PAYMENT_WAITING">결제 대기</option>
                                                <option value="PAID">결제 완료</option>
                                                <option value="PREPARING">배송 준비중</option>
                                                <option value="SHIPPING">배송중</option>
                                                <option value="DELIVERED">배송 완료</option>
                                                <option value="CANCELED">주문 취소</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* 상세 페이지 라우팅 */}
                                            <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10" title="상세보기">
                                                <Icon icon="solar:document-add-line-duotone" width={22} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBox>
        </div>
    );
};

export default OrderManagementPage;