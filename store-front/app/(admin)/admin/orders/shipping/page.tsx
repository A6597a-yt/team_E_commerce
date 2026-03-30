"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// 배송 관리에 필요한 주문 데이터 타입
interface ShippingOrder {
    id: number;
    orderNumber: string;
    orderDate: string;
    recipientName: string;
    phone: string;
    address: string;
    memo: string; // 배송 요청사항
    courier: string;
    trackingNumber: string;
    status: 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'RETURNED';
}

const ShippingManagementPage = () => {
    // --- 상태 관리 (기존 로직 100% 보존) ---
    const [orders, setOrders] = useState<ShippingOrder[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // --- API 호출 로직 (기존 로직 보존) ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setOrders([
                { id: 1, orderNumber: 'ORD-20260329-001', orderDate: '2026-03-29 10:30', recipientName: '홍길동', phone: '010-1234-5678', address: '인천광역시 연수구 송도동 123-45 101동 202호', memo: '문 앞에 두고 가주세요', courier: '우체국택배', trackingNumber: '', status: 'PREPARING' },
                { id: 2, orderNumber: 'ORD-20260328-002', orderDate: '2026-03-28 15:20', recipientName: '김철수', phone: '010-9876-5432', address: '서울특별시 강남구 테헤란로 123 (역삼동)', memo: '배송 전 연락 바랍니다', courier: '우체국택배', trackingNumber: '686412345678', status: 'SHIPPING' },
                { id: 3, orderNumber: 'ORD-20260327-003', orderDate: '2026-03-27 09:15', recipientName: '이영희', phone: '010-5555-4444', address: '부산광역시 해운대구 센텀중앙로 45', memo: '부재 시 경비실에 맡겨주세요', courier: 'CJ대한통운', trackingNumber: '550198765432', status: 'DELIVERED' },
                { id: 4, orderNumber: 'ORD-20260329-004', orderDate: '2026-03-29 14:00', recipientName: '박지성', phone: '010-7777-8888', address: '경기도 성남시 분당구 판교역로 234', memo: '', courier: '우체국택배', trackingNumber: '', status: 'PREPARING' },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    // --- 이벤트 핸들러 (기존 로직 100% 보존) ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(filteredOrders.map(o => o.id));
        else setSelectedIds([]);
    };

    const handleSelectItem = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleInputChange = (id: number, field: 'courier' | 'trackingNumber', value: string) => {
        setOrders(prev => prev.map(order => order.id === id ? { ...order, [field]: value } : order));
    };

    const handleSaveSingle = (id: number) => {
        const order = orders.find(o => o.id === id);
        if (!order?.trackingNumber) {
            alert("운송장 번호를 입력해주세요.");
            return;
        }
        alert(`[${order.orderNumber}] 운송장 정보가 저장되었습니다.`);
    };

    const handleBatchStatusChange = (newStatus: 'SHIPPING' | 'DELIVERED') => {
        if (selectedIds.length === 0) {
            alert("상태를 변경할 주문을 선택해주세요.");
            return;
        }
        if (confirm(`선택한 ${selectedIds.length}건의 주문을 '${newStatus === 'SHIPPING' ? '배송중' : '배송완료'}' 처리하시겠습니까?`)) {
            setOrders(prev => prev.map(order =>
                selectedIds.includes(order.id) ? { ...order, status: newStatus } : order
            ));
            setSelectedIds([]);
        }
    };

    const filteredOrders = orders.filter(order => statusFilter === 'ALL' || order.status === statusFilter);

    return (
        <div className="flex flex-col gap-8 max-w-full mx-auto p-4 md:p-8">

            {/* 1. 상단 헤더 및 요약 위젯 */}
            <div className="mb-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">배송 관리</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 mt-2">출고 대기 중인 주문의 운송장을 등록하고 배송 상태를 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: '배송 준비중 (송장입력 대기)', count: orders.filter(o => o.status === 'PREPARING').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { title: '배송중', count: orders.filter(o => o.status === 'SHIPPING').length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { title: '배송 완료', count: orders.filter(o => o.status === 'DELIVERED').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { title: '반송/교환', count: orders.filter(o => o.status === 'RETURNED').length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
                ].map((stat, idx) => (
                    <CardBox key={idx} className="p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.title}</p>
                            <h4 className={`text-3xl font-extrabold mt-2 ${stat.color}`}>{stat.count}건</h4>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <Icon icon="solar:box-minimalistic-line-duotone" className={stat.color} width={28} />
                        </div>
                    </CardBox>
                ))}
            </div>

            {/* 2. 메인 배송 목록 영역 */}
            <CardBox className="p-6 md:p-8">

                {/* 툴바 (필터 및 일괄 처리 버튼) */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                            총 {selectedIds.length}건 선택됨
                        </span>
                        <button
                            onClick={() => handleBatchStatusChange('SHIPPING')}
                            className="flex items-center gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm shadow-blue-900/20"
                        >
                            <Icon icon="solar:routing-2-line-duotone" width={18} />
                            선택 건 배송중 처리
                        </button>
                        <button
                            onClick={() => handleBatchStatusChange('DELIVERED')}
                            className="flex items-center gap-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm shadow-emerald-900/20"
                        >
                            <Icon icon="solar:check-read-line-duotone" width={18} />
                            선택 건 배송완료 처리
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="py-2.5 pl-4 pr-10 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary shadow-inner bg-white dark:bg-slate-900 dark:text-white"
                        >
                            <option value="ALL">상태 전체보기</option>
                            <option value="PREPARING">배송 준비중</option>
                            <option value="SHIPPING">배송중</option>
                            <option value="DELIVERED">배송 완료</option>
                        </select>
                    </div>
                </div>

                {/* 3. 배송 관리 테이블 (가로 스크롤 영역) */}
                <div className="overflow-x-auto">
                    {/* 변경점 1: min-w-[1100px] 추가로 테이블 전체 최소 너비 강제 확보 */}
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                <th className="p-4 w-12 text-center">
                                    <input type="checkbox" checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length} onChange={handleSelectAll} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                                </th>
                                <th className="p-4 w-48">주문일시/번호</th>
                                <th className="p-4 w-[35%]">수령인 및 배송지</th>
                                <th className="p-4 w-72">운송장 정보 입력</th>
                                {/* 변경점 2: 상태 컬럼 너비 약간 증가 (w-32) */}
                                <th className="p-4 text-center w-32">상태</th>
                                <th className="p-4 text-center w-24">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">데이터를 불러오는 중입니다...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500">해당 상태의 배송 건이 없습니다.</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-center align-top pt-5">
                                            <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => handleSelectItem(order.id)} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                                        </td>
                                        <td className="p-4 align-top pt-5">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{order.orderDate}</div>
                                            <div className="font-bold text-slate-800 dark:text-white text-sm">{order.orderNumber}</div>
                                        </td>
                                        <td className="p-4 align-top pt-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-900 dark:text-white">{order.recipientName}</span>
                                                <span className="text-xs text-slate-500">{order.phone}</span>
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400 leading-snug break-keep">
                                                {order.address}
                                            </div>
                                            {order.memo && (
                                                <div className="mt-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400 px-2 py-1 rounded inline-block">
                                                    요청: {order.memo}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-top pt-4">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={order.courier}
                                                    onChange={(e) => handleInputChange(order.id, 'courier', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-primary bg-white dark:bg-slate-900 shadow-inner"
                                                >
                                                    <option value="우체국택배">우체국택배</option>
                                                    <option value="CJ대한통운">CJ대한통운</option>
                                                    <option value="로젠택배">로젠택배</option>
                                                    <option value="한진택배">한진택배</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="송장번호 입력 (- 제외)"
                                                    value={order.trackingNumber}
                                                    onChange={(e) => handleInputChange(order.id, 'trackingNumber', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-primary bg-white dark:bg-slate-900 shadow-inner"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center align-top pt-6">
                                            {/* 변경점 3: whitespace-nowrap 추가로 절대 줄바꿈되지 않도록 이중 방어 */}
                                            {order.status === 'PREPARING' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">배송준비중</span>}
                                            {order.status === 'SHIPPING' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">배송중</span>}
                                            {order.status === 'DELIVERED' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">배송완료</span>}
                                            {order.status === 'RETURNED' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200 whitespace-nowrap">반송됨</span>}
                                        </td>
                                        <td className="p-4 text-center align-top pt-6">
                                            <button
                                                onClick={() => handleSaveSingle(order.id)}
                                                className="text-xs bg-slate-800 text-white hover:bg-slate-700 px-3 py-2 rounded-md font-semibold transition-colors shadow-sm w-full"
                                            >
                                                저장
                                            </button>
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

export default ShippingManagementPage;