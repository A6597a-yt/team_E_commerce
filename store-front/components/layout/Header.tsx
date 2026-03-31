'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 클라이언트 사이드에서만 토큰 확인
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        window.location.href = '/'; // 메인으로 이동하며 상태 초기화
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <Icon icon="solar:Skateboard-bold" className="text-white" width={20} />
                    </div>
                    <span className="text-xl font-black tracking-tighter">TACTICAL SHOP</span>
                </Link>

                {/* 우측 메뉴 */}
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/cart" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                                <Icon icon="solar:cart-large-minimalistic-bold" width={24} />
                            </Link>
                            <Link href="/mypage" className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1">
                                <Icon icon="solar:user-circle-bold" width={24} />
                                <span className="text-sm font-bold hidden md:inline">마이페이지</span>
                            </Link>
                            <button onClick={handleLogout} className="text-sm font-bold text-slate-500 hover:text-red-500">
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600">
                                로그인
                            </Link>
                            <Link href="/signup" className="px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all">
                                시작하기
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}