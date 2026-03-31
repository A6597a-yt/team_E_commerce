'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';

// 사이드바 메뉴 구성
const menuItems = [
    { name: '마이 대시보드', href: '/mypage', icon: 'solar:home-smile-bold-duotone' },
    { name: '주문 내역', href: '/mypage/orders', icon: 'solar:clipboard-list-bold-duotone' },
    { name: '1:1 문의 내역', href: '/mypage/inquiry', icon: 'solar:chat-dot-square-bold-duotone' },
    { name: '내 정보 수정', href: '/mypage/profile', icon: 'solar:user-id-bold-duotone' },
];

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    // ✅ [권한 체크 로직] 레이아웃 진입 시 토큰 확인
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            alert('로그인이 필요한 서비스입니다.');
            router.replace('/login'); // replace를 사용해 뒤로가기 방지
        } else {
            setIsChecking(false); // 토큰이 있으면 로딩 해제
        }
    }, [router]);

    // 체크 중일 때는 아무것도 보여주지 않음 (깜빡임 방지)
    if (isChecking) {
        return <div className="min-h-screen flex items-center justify-center">보안 확인 중...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">

                {/* --- 사이드바 (Sidebar) --- */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                                    <Icon icon="solar:user-bold" width={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">홍길동 님</h3>
                                    <p className="text-xs text-slate-500">일반 회원</p>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-1">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <Icon icon={item.icon} width={20} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* 간편 고객센터 안내 */}
                        <div className="p-6 bg-orange-50 dark:bg-orange-950/20 rounded-3xl border border-orange-100 dark:border-orange-900/30">
                            <p className="text-xs font-bold text-orange-600 mb-1">도움이 필요하신가요?</p>
                            <p className="text-[11px] text-orange-800 dark:text-orange-300 leading-relaxed">
                                주문/결제 관련 문의는<br />1:1 문의를 이용해주세요.
                            </p>
                            <Link href="/cs" className="text-[11px] font-black text-orange-600 underline mt-2 block">
                                고객센터 바로가기
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* --- 메인 콘텐츠 (Content) --- */}
                <main className="flex-1 min-w-0 bg-white dark:bg-transparent rounded-3xl">
                    {children}
                </main>
            </div>
        </div>
    );
}