"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// 타입 정의
interface UserDetail {
    id: number;
    name: string;
    userId: string;
    joinDate: string;
    contact: string;
    email: string;
    address: string;
    totalSpent: number;
    points: number;
    orderCount: number;
    status: 'ACTIVE' | 'DORMANT' | 'SUSPENDED' | 'WITHDRAWN';
    adminMemo: string;
}

interface OrderHistory {
    id: number;
    orderNumber: string;
    orderDate: string;
    productName: string;
    totalAmount: number;
    status: 'PAID' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELED';
}

const UserDetailPage = ({ params }: { params: { id: string } }) => {
    // --- 상태 관리 ---
    const [user, setUser] = useState<UserDetail | null>(null);
    const [orders, setOrders] = useState<OrderHistory[]>([]);
    const [memoInput, setMemoInput] = useState('');

    // --- API 호출 뼈대 (더미 데이터 세팅) ---
    useEffect(() => {
        setUser({
            id: Number(params.id),
            name: '홍길동',
            userId: 'hong123',
            joinDate: '2026-03-25 14:30',
            contact: '010-1234-5678',
            email: 'hong@example.com',
            address: '인천광역시 연수구 송도동 123-45 101동 202호',
            totalSpent: 1250000,
            points: 15000,
            orderCount: 12,
            status: 'ACTIVE',
            adminMemo: 'VIP 고객. 배송 지연 시 즉각적인 응대 필요함. (2026.03.20 작성)'
        });
        setOrders([
            { id: 101, orderNumber: 'ORD-20260329-001', orderDate: '2026-03-29 10:30', productName: '고성능 전동건 M4A1 외 1건', totalAmount: 535000, status: 'PREPARING' },
            { id: 98, orderNumber: 'ORD-20260215-042', orderDate: '2026-02-15 14:20', productName: '전술 방탄 조끼 멀티캠', totalAmount: 85000, status: 'DELIVERED' },
            { id: 45, orderNumber: 'ORD-20251111-088', orderDate: '2025-11-11 09:15', productName: '비비탄 0.2g (5000발)', totalAmount: 12000, status: 'DELIVERED' },
        ]);
    }, [params.id]);

    useEffect(() => {
        if (user) setMemoInput(user.adminMemo);
    }, [user]);

    // --- 이벤트 핸들러 ---
    const handleSaveMemo = () => {
        setUser(prev => prev ? { ...prev, adminMemo: memoInput } : null);
        alert('관리자 메모가 안전하게 저장되었습니다.');
    };

    const handleSendPasswordReset = () => {
        if (confirm(`가입된 이메일(${user?.email})로 비밀번호 재설정 링크를 발송하시겠습니까?`)) {
            alert('비밀번호 재설정 메일이 성공적으로 발송되었습니다.');
        }
    };

    const handleToggleSuspend = () => {
        if (!user) return;

        if (user.status === 'SUSPENDED') {
            if (confirm('이 계정의 정지를 해제하고 정상 상태로 복구하시겠습니까?')) {
                setUser({ ...user, status: 'ACTIVE' });
                alert('계정이 정상화되었습니다.');
            }
        } else {
            const reason = prompt("영구 정지 사유를 입력해주세요.\n(예: 잦은 악성 클레임, 부정 결제 시도 등)");
            if (reason) {
                setUser({ ...user, status: 'SUSPENDED' });
                setMemoInput(prev => `[영구 정지됨] 사유: ${reason}\n\n${prev}`);
                alert('계정이 영구 정지(차단) 처리되었습니다.');
            }
        }
    };

    if (!user) return <div className="p-8 text-center text-slate-500">회원 정보를 불러오는 중...</div>;

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 md:p-8">

            {/* 1. 상단 헤더 */}
            <div className="flex items-center gap-4 mb-2">
                <Link href="/admin/users" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Icon icon="solar:alt-arrow-left-line-duotone" width={24} />
                </Link>
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        {user.name} <span className="text-lg text-slate-500 font-medium">({user.userId})</span>
                    </h2>
                    {user.status === 'ACTIVE' && <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">정상 회원</span>}
                    {user.status === 'DORMANT' && <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600">휴면 회원</span>}
                    {user.status === 'SUSPENDED' && <span className="px-3 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">영구 정지됨</span>}
                </div>
            </div>

            {/* 2. 최상단 요약 통계 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    // 수정됨: style 속성 제거 및 textColor, borderColor 클래스 분리 할당
                    { label: '가입일', value: user.joinDate.split(' ')[0], icon: 'solar:calendar-date-line-duotone', textColor: 'text-blue-600', borderColor: 'border-blue-600' },
                    { label: '총 주문 건수', value: `${user.orderCount}건`, icon: 'solar:box-minimalistic-line-duotone', textColor: 'text-emerald-600', borderColor: 'border-emerald-600' },
                    { label: '누적 구매액', value: `${user.totalSpent.toLocaleString()}원`, icon: 'solar:wallet-money-line-duotone', textColor: 'text-indigo-600', borderColor: 'border-indigo-600' },
                    { label: '보유 적립금', value: `${user.points.toLocaleString()} P`, icon: 'solar:wad-of-money-line-duotone', textColor: 'text-amber-600', borderColor: 'border-amber-600' },
                ].map((stat) => (
                    // 수정됨: className에 Tailwind border 색상 주입
                    <CardBox key={stat.label} className={`p-5 flex flex-col gap-3 border-t-4 ${stat.borderColor}`}>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Icon icon={stat.icon} width={20} className={stat.textColor} />
                            <span className="text-sm font-semibold">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            {stat.value}
                        </div>
                    </CardBox>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-2">

                {/* 좌측: 정보 및 관리자 제어 패널 */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    <CardBox className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                            <Icon icon="solar:user-id-line-duotone" className="text-primary" width={22} />
                            고객 기본 정보
                        </h3>
                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 font-semibold">연락처</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{user.contact}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 font-semibold">이메일</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{user.email}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 font-semibold">기본 배송지</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{user.address}</span>
                            </div>
                        </div>
                    </CardBox>

                    <CardBox className="p-6 bg-amber-50/30 dark:bg-amber-900/10 border-amber-200/50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-amber-700 dark:text-amber-500 flex items-center gap-2">
                                <Icon icon="solar:notes-minimalistic-line-duotone" width={22} />
                                관리자 전용 메모
                            </h3>
                            <button onClick={handleSaveMemo} className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md font-semibold transition-colors">
                                저장
                            </button>
                        </div>
                        <textarea
                            value={memoInput}
                            onChange={(e) => setMemoInput(e.target.value)}
                            placeholder="고객 응대 이력이나 특이사항을 기록하세요. (고객에게는 노출되지 않습니다)"
                            className="w-full h-32 px-3 py-2 text-sm border border-amber-200 dark:border-amber-800/50 rounded-lg focus:outline-none focus:border-amber-500 bg-white dark:bg-slate-900 resize-none shadow-inner"
                        />
                    </CardBox>

                    <CardBox className="p-6 border-red-100 dark:border-red-900/30">
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-5 flex items-center gap-2">
                            <Icon icon="solar:shield-warning-line-duotone" width={22} />
                            계정 제어 패널
                        </h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSendPasswordReset}
                                className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-700"
                            >
                                <span>비밀번호 재설정 링크 발송</span>
                                <Icon icon="solar:letter-line-duotone" width={18} />
                            </button>

                            <button
                                onClick={handleToggleSuspend}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors border ${user.status === 'SUSPENDED'
                                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                        : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                                    }`}
                            >
                                <span>{user.status === 'SUSPENDED' ? '영구 정지 해제 (정상화)' : '계정 영구 정지 (차단)'}</span>
                                <Icon icon={user.status === 'SUSPENDED' ? 'solar:shield-check-line-duotone' : 'solar:forbidden-circle-line-duotone'} width={18} />
                            </button>
                        </div>
                    </CardBox>

                </div>

                {/* 우측: 최근 주문 내역 */}
                <div className="lg:col-span-2">
                    <CardBox className="p-0 overflow-hidden h-full flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Icon icon="solar:bag-3-line-duotone" className="text-primary" width={22} />
                                최근 주문 내역
                            </h3>
                            <span className="text-sm text-slate-500">최근 10건</span>
                        </div>

                        <div className="p-6 flex-1">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500">
                                            <th className="pb-3 w-32">주문일시</th>
                                            <th className="pb-3">상품명 및 주문번호</th>
                                            <th className="pb-3 text-right w-28">결제금액</th>
                                            <th className="pb-3 text-center w-24">상태</th>
                                            <th className="pb-3 text-center w-20">상세</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr><td colSpan={5} className="py-8 text-center text-slate-500">주문 내역이 없습니다.</td></tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="py-4 text-xs text-slate-500">{order.orderDate.split(' ')[0]}</td>
                                                    <td className="py-4">
                                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{order.productName}</div>
                                                        <div className="text-xs text-slate-400 mt-1">{order.orderNumber}</div>
                                                    </td>
                                                    <td className="py-4 text-right font-bold text-slate-800 dark:text-slate-200 text-sm">
                                                        {order.totalAmount.toLocaleString()}원
                                                    </td>
                                                    <td className="py-4 text-center">
                                                        {order.status === 'PAID' && <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">결제완료</span>}
                                                        {order.status === 'PREPARING' && <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">배송준비중</span>}
                                                        {order.status === 'SHIPPING' && <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">배송중</span>}
                                                        {order.status === 'DELIVERED' && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">배송완료</span>}
                                                        {order.status === 'CANCELED' && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">취소됨</span>}
                                                    </td>
                                                    <td className="py-4 text-center">
                                                        <Link href={`/admin/orders/${order.id}`} className="text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md font-semibold transition-colors shadow-sm">
                                                            보기
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardBox>
                </div>

            </div>
        </div>
    );
};

export default UserDetailPage;