'use client';

// 1. CSS 격리 방어벽 (일반 쇼핑몰 테마 보호용 - 절대 지우지 마세요)
import "@/styles/admin/css/globals.css";

// 2. 템플릿 컴포넌트 Import
import Header from "@/components/admin/layout/header/Header";
import Topbar from "@/components/admin/layout/header/Topbar";
import Sidebar from "@/components/admin/layout/sidebar/Sidebar";
import Link from "next/link"; // Link 추가

export default function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Topbar />

            <div className='flex w-full min-h-screen'>
                <div className='page-wrapper flex w-full'>

                    <div className='xl:block hidden'>
                        <Sidebar />
                    </div>

                    <div className='body-wrapper w-full bg-background'>
                        <Header />

                        <div className={`container mx-auto px-6 py-30`}>
                            {/* 시연용 알림 발송 로그 이동 버튼 */}
                            <div className="mb-6 flex justify-end">
                                <Link
                                    href="/admin/notifications"
                                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors"
                                >
                                    알림 발송 로그 확인 (비동기 시연용)
                                </Link>
                            </div>

                            {/* 자식 페이지(대시보드 위젯들)가 렌더링되는 본문 영역 */}
                            {children}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}