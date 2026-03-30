'use client';

// 1. CSS 격리 방어벽 (일반 쇼핑몰 테마 보호용 - 절대 지우지 마세요)
import "@/styles/admin/css/globals.css";

// 2. 템플릿 컴포넌트 Import 
import Header from "@/components/admin/layout/header/Header";
import Topbar from "@/components/admin/layout/header/Topbar";
import Sidebar from "@/components/admin/layout/sidebar/Sidebar";

export default function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/* 2단계: 누락되었던 Topbar 컴포넌트 복원 */}
            <Topbar />

            {/* 3단계: 템플릿 원본의 DOM 구조와 클래스명(page-wrapper 등) 완벽 동기화 */}
            <div className='flex w-full min-h-screen'>
                <div className='page-wrapper flex w-full'>

                    {/* 1단계: 에러를 뿜던 상태 관리 Props(isSidebarOpen 등) 완전 제거 */}
                    <div className='xl:block hidden'>
                        <Sidebar />
                    </div>

                    <div className='body-wrapper w-full bg-background'>
                        {/* 상단 헤더 (Props 완전 제거) */}
                        <Header />

                        {/* 자식 페이지(대시보드 위젯들)가 렌더링되는 본문 영역 */}
                        <div className={`container mx-auto px-6 py-30`}>
                            {children}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}