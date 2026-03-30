"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// 회원 데이터 타입 정의
interface User {
    id: number;
    joinDate: string;
    name: string;
    userId: string;
    contact: string;
    email: string;
    totalSpent: number;
    points: number; // 보유 적립금
    status: 'ACTIVE' | 'DORMANT' | 'SUSPENDED' | 'WITHDRAWN';
}

const UserManagementPage = () => {
    // --- 상태 관리 ---
    const [users, setUsers] = useState<User[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 필터 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('all');

    // 적립금 모달 상태
    const [isPointModalOpen, setIsPointModalOpen] = useState(false);
    const [pointForm, setPointForm] = useState({ action: 'ADD', amount: '', reason: '' });

    // --- API 호출 로직 (더미 데이터 세팅) ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setUsers([
                { id: 1, joinDate: '2026-03-25 14:30', name: '홍길동', userId: 'hong123', contact: '010-1234-5678', email: 'hong@example.com', totalSpent: 1250000, points: 15000, status: 'ACTIVE' },
                { id: 2, joinDate: '2026-03-20 10:15', name: '김철수', userId: 'ironman99', contact: '010-9876-5432', email: 'iron@example.com', totalSpent: 45000, points: 2000, status: 'ACTIVE' },
                { id: 3, joinDate: '2025-11-11 09:00', name: '이영희', userId: 'younghee', contact: '010-5555-4444', email: 'young@example.com', totalSpent: 0, points: 0, status: 'DORMANT' },
                { id: 4, joinDate: '2026-03-28 16:45', name: '박지성', userId: 'parkjs', contact: '010-7777-8888', email: 'park@example.com', totalSpent: 350000, points: 5000, status: 'SUSPENDED' },
                { id: 5, joinDate: '2026-01-05 11:20', name: '최동원', userId: 'choi11', contact: '010-2222-3333', email: 'choi@example.com', totalSpent: 85000, points: 500, status: 'WITHDRAWN' },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    // --- 이벤트 핸들러 ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(filteredUsers.map(u => u.id));
        else setSelectedIds([]);
    };

    const handleSelectItem = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    // 적립금 모달 열기/닫기
    const handleOpenPointModal = () => {
        if (selectedIds.length === 0) {
            alert("적립금을 관리할 회원을 선택해주세요.");
            return;
        }
        setPointForm({ action: 'ADD', amount: '', reason: '' });
        setIsPointModalOpen(true);
    };

    const handleClosePointModal = () => {
        setIsPointModalOpen(false);
    };

    // 적립금 지급/차감 처리 (마이너스 방어 로직 포함)
    const handlePointSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNum = parseInt(pointForm.amount);

        if (!amountNum || amountNum <= 0) {
            alert("올바른 금액을 입력해주세요.");
            return;
        }
        if (!pointForm.reason.trim()) {
            alert("지급/차감 사유를 입력해주세요.");
            return;
        }

        const selectedUsers = users.filter(u => selectedIds.includes(u.id));

        // 방어 로직: 차감 시 잔액 부족 체크
        if (pointForm.action === 'DEDUCT') {
            // 선택된 회원 중 가장 적은 적립금 잔액 찾기
            const minPoints = Math.min(...selectedUsers.map(u => u.points));
            if (amountNum > minPoints) {
                alert(`차감하려는 금액(${amountNum.toLocaleString()}원)이 회원의 보유 잔액보다 많습니다.\n선택한 회원 중 최소 보유 잔액: ${minPoints.toLocaleString()}원`);
                return; // 처리 중단
            }
        }

        // 상태 업데이트 로직 (API 연동 시 대체)
        setUsers(prev => prev.map(user => {
            if (selectedIds.includes(user.id)) {
                const newPoints = pointForm.action === 'ADD' ? user.points + amountNum : user.points - amountNum;
                return { ...user, points: newPoints };
            }
            return user;
        }));

        alert(`선택한 ${selectedIds.length}명의 회원에게 적립금이 성공적으로 ${pointForm.action === 'ADD' ? '지급' : '차감'}되었습니다.`);
        setIsPointModalOpen(false);
        setSelectedIds([]); // 선택 초기화
    };

    // 필터링 적용
    const filteredUsers = users.filter(user => statusFilter === 'ALL' || user.status === statusFilter);

    return (
        <div className="flex flex-col gap-8 max-w-full mx-auto p-4 md:p-8">

            {/* 1. 상단 헤더 및 요약 위젯 */}
            <div className="mb-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">회원 관리</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 mt-2">쇼핑몰 가입 고객의 정보, 적립금, 계정 상태를 종합적으로 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: '전체 회원', count: users.length, color: 'text-primary', bg: 'bg-primary/10' },
                    { title: '신규 가입 (이번 달)', count: 2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { title: '휴면 회원', count: users.filter(u => u.status === 'DORMANT').length, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
                    { title: '정지/탈퇴', count: users.filter(u => u.status === 'SUSPENDED' || u.status === 'WITHDRAWN').length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
                ].map((stat, idx) => (
                    <CardBox key={idx} className="p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.title}</p>
                            <h4 className={`text-3xl font-extrabold mt-2 ${stat.color}`}>{stat.count}명</h4>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg}`}>
                            <Icon icon="solar:users-group-two-rounded-bold-duotone" className={stat.color} width={28} />
                        </div>
                    </CardBox>
                ))}
            </div>

            {/* 2. 메인 회원 목록 영역 */}
            <CardBox className="p-6 md:p-8 relative">

                {/* 툴바 */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                            총 {selectedIds.length}명 선택됨
                        </span>
                        <button
                            onClick={handleOpenPointModal}
                            className="flex items-center gap-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm shadow-indigo-900/20"
                        >
                            <Icon icon="solar:wad-of-money-line-duotone" width={18} />
                            적립금 지급/차감
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <select
                            value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                            className="py-2.5 pl-4 pr-10 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary shadow-inner bg-white dark:bg-slate-900 dark:text-white"
                        >
                            <option value="all">가입일 전체</option>
                            <option value="today">오늘</option>
                            <option value="1month">최근 1개월</option>
                        </select>

                        <select
                            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="py-2.5 pl-4 pr-10 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary shadow-inner bg-white dark:bg-slate-900 dark:text-white"
                        >
                            <option value="ALL">상태 전체보기</option>
                            <option value="ACTIVE">정상 회원</option>
                            <option value="DORMANT">휴면 회원</option>
                            <option value="SUSPENDED">정지 (차단)</option>
                            <option value="WITHDRAWN">탈퇴 회원</option>
                        </select>

                        <div className="relative flex-1 lg:w-64">
                            <Icon icon="solar:magnifer-line-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width={18} />
                            <input
                                type="text" placeholder="이름, 아이디, 연락처 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary shadow-inner bg-white dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. 회원 데이터 테이블 (깨짐 방지 min-w 적용) */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1050px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                <th className="p-4 w-12 text-center">
                                    <input type="checkbox" checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length} onChange={handleSelectAll} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                                </th>
                                <th className="p-4 w-40">가입일시</th>
                                <th className="p-4 w-48">이름 (아이디)</th>
                                <th className="p-4 w-64">연락처 / 이메일</th>
                                <th className="p-4 text-right w-36">누적 구매액</th>
                                <th className="p-4 text-right w-32">보유 적립금</th>
                                <th className="p-4 text-center w-28">상태</th>
                                <th className="p-4 text-center w-20">상세</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8} className="p-8 text-center text-slate-500">데이터를 불러오는 중입니다...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={8} className="p-8 text-center text-slate-500">조건에 맞는 회원이 없습니다.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-center">
                                            <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => handleSelectItem(user.id)} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                                        </td>
                                        <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{user.joinDate}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{user.userId}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.contact}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                                        </td>
                                        <td className="p-4 text-right font-bold text-slate-800 dark:text-slate-200">
                                            {user.totalSpent.toLocaleString()}원
                                        </td>
                                        <td className="p-4 text-right font-extrabold text-indigo-600 dark:text-indigo-400">
                                            {user.points.toLocaleString()} P
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.status === 'ACTIVE' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">정상</span>}
                                            {user.status === 'DORMANT' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 whitespace-nowrap">휴면</span>}
                                            {user.status === 'SUSPENDED' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap">정지</span>}
                                            {user.status === 'WITHDRAWN' && <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-800 text-white whitespace-nowrap">탈퇴</span>}
                                        </td>
                                        <td className="p-4 text-center">
                                            <Link href={`/admin/users/${user.id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10 bg-slate-50 dark:bg-slate-800" title="회원 상세 보기">
                                                <Icon icon="solar:user-id-linear" width={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 적립금 일괄 관리 모달 (Modal) */}
                {isPointModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Icon icon="solar:wad-of-money-line-duotone" className="text-indigo-600" width={24} />
                                    적립금 지급 / 차감
                                </h3>
                                <button onClick={handleClosePointModal} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <Icon icon="solar:close-circle-line-duotone" width={24} />
                                </button>
                            </div>

                            <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 p-3 rounded-lg text-sm font-semibold mb-6 border border-indigo-100 dark:border-indigo-900/50">
                                선택된 회원: {selectedIds.length}명
                            </div>

                            <form onSubmit={handlePointSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">처리 구분</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="action" value="ADD" checked={pointForm.action === 'ADD'} onChange={(e) => setPointForm({ ...pointForm, action: e.target.value })} className="text-indigo-600 focus:ring-indigo-600" />
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">지급 (+)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="action" value="DEDUCT" checked={pointForm.action === 'DEDUCT'} onChange={(e) => setPointForm({ ...pointForm, action: e.target.value })} className="text-red-600 focus:ring-red-600" />
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">차감 (-)</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">금액 (원)</label>
                                    <input
                                        type="number"
                                        value={pointForm.amount}
                                        onChange={(e) => setPointForm({ ...pointForm, amount: e.target.value })}
                                        placeholder="예: 5000"
                                        className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-800 font-bold shadow-inner"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">사유 (고객에게 노출됨)</label>
                                    <input
                                        type="text"
                                        value={pointForm.reason}
                                        onChange={(e) => setPointForm({ ...pointForm, reason: e.target.value })}
                                        placeholder="예: 베스트 리뷰어 이벤트 당첨"
                                        className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 bg-white dark:bg-slate-800 shadow-inner"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button type="button" onClick={handleClosePointModal} className="px-5 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                                        취소
                                    </button>
                                    <button type="submit" className={`px-5 py-2.5 text-sm rounded-lg text-white font-medium transition-colors shadow-sm ${pointForm.action === 'ADD' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                        적립금 {pointForm.action === 'ADD' ? '지급' : '차감'} 처리
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </CardBox>
        </div>
    );
};

export default UserManagementPage;