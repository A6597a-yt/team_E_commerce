"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useTheme } from 'next-themes'; // ThemeProvider와 연동

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [cartCount, setCartCount] = useState(2); // 임시 장바구니 수량

    // Hydration mismatch 방지 (Next.js 16 표준)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">

            {/* --- 1. 상단 고정 헤더 (GNB) --- */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

                    {/* 로고 영역 */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-slate-900 dark:bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                                <Icon icon="solar:target-bold" className="text-white" width={22} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white hidden sm:block">
                                TACTICAL<span className="text-blue-600 ml-0.5">SHOP</span>
                            </span>
                        </Link>

                        {/* 메인 메뉴 (데스크톱) */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600 dark:text-slate-400">
                            <Link href="/category/airsoft" className="hover:text-blue-600 transition-colors">에어소프트건</Link>
                            <Link href="/category/gear" className="hover:text-blue-600 transition-colors">장구류</Link>
                            <Link href="/category/model" className="hover:text-blue-600 transition-colors">프라모델</Link>
                        </nav>
                    </div>

                    {/* 유저 액션 영역 */}
                    <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">

                        {/* [검색창] 아이콘 클릭 시 확장되는 애니메이션 폼 */}
                        <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'flex-1 max-w-md' : 'w-10'}`}>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isSearchOpen ? 'absolute left-0 z-10' : ''}`}
                            >
                                <Icon icon="solar:magnifer-linear" width={24} className="text-slate-600 dark:text-slate-400" />
                            </button>
                            <input
                                type="text"
                                placeholder="찾으시는 장비를 검색하세요..."
                                className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${isSearchOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
                            />
                        </div>

                        {/* 테마 토글 */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Icon icon={theme === 'dark' ? "solar:sun-bold-duotone" : "solar:moon-bold-duotone"} width={24} className="text-amber-500" />
                        </button>

                        {/* 로그인 & 장바구니 */}
                        <div className="flex items-center gap-1 md:gap-3 ml-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                            <Link href="/login" className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                                <Icon icon="solar:user-linear" width={24} className="md:hidden" />
                                <span className="hidden md:inline">로그인</span>
                            </Link>

                            <Link href="/cart" className="relative p-2 group">
                                <Icon icon="solar:cart-large-minimalistic-linear" width={26} className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- 2. 페이지 본문 --- */}
            <main className="flex-grow">
                {children}
            </main>

            {/* --- 3. 하단 푸터 (Footer) --- */}
            <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* 회사소개 */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-400 rounded-md flex items-center justify-center">
                                <Icon icon="solar:target-bold" className="text-white" width={14} />
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">TACTICAL SHOP</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                            최고의 에어소프트 기어와 밀리터리 장비를 제공합니다. <br />
                            전문가가 직접 검수한 정품만을 취급하며, 당신의 미션을 지원합니다.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <Icon icon="solar:camera-add-linear" width={24} className="text-slate-400 hover:text-blue-600 cursor-pointer" />
                            <Icon icon="solar:videocamera-record-linear" width={24} className="text-slate-400 hover:text-blue-600 cursor-pointer" />
                        </div>
                    </div>

                    {/* 고객센터 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">고객센터</h4>
                        <div className="flex flex-col gap-2">
                            <span className="text-2xl font-black text-blue-600">1588-0000</span>
                            <p className="text-xs text-slate-500">
                                평일 10:00 - 18:00 (점심 12:00 - 13:00)<br />
                                주말 및 공휴일 휴무
                            </p>
                        </div>
                    </div>

                    {/* 정보 링크 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Quick Links</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-500">
                            <li className="hover:text-blue-600 cursor-pointer">이용약관</li>
                            <li className="hover:text-blue-600 cursor-pointer font-bold text-slate-700 dark:text-slate-300">개인정보처리방침</li>
                            <li className="hover:text-blue-600 cursor-pointer">배송/교환/반품 안내</li>
                            <li className="hover:text-blue-600 cursor-pointer font-bold">대량 구매 문의</li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-[11px] text-slate-400">
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span>상호: (주)택티컬샵</span>
                        <span>대표: 홍길동</span>
                        <span>사업자번호: 123-45-67890</span>
                        <span>통신판매업: 제2026-서울강남-0000호</span>
                        <span>주소: 서울특별시 강남구 테헤란로...</span>
                    </div>
                    <p>© 2026 TACTICAL SHOP. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
}