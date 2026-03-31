"use client"
import React, { useState } from "react";

// 1. 개조 완료된 위젯들 임포트 (상대 경로 주의)
import SalesOverview from "@/components/admin/dashboard/SalesOverview";
import BestSeller from "@/components/admin/dashboard/BestSeller";

import { YearlyBreakup } from "@/components/admin/dashboard/YearlyBreakup";
import { MonthlyEarning } from "@/components/admin/dashboard/MonthlyEarning";
import { RecentTransaction } from "@/components/admin/dashboard/RecentTransaction";
import { ProductPerformance } from "@/components/admin/dashboard/ProductPerformance";
import { StaffPerformance } from "@/components/admin/dashboard/StaffPerformance";
import { Footer } from "@/components/admin/dashboard/Footer";

const DashboardPage = () => {
    // 2. 권한 테스트용 상태 (나중에 실제 로그인 정보와 연동)
    // '일반 관리자'로 바꾸면 직원 성과표가 사라지는 것을 확인할 수 있습니다.
    const [userRole] = useState("최고 관리자");

    return (
        <div className="min-h-screen flex flex-col gap-6 p-6 bg-slate-50/50 dark:bg-slate-900/50">

            {/* [첫 번째 행] 매출 개요 및 요약 통계 */}
            <div className="grid grid-cols-12 gap-6">
                <div className="lg:col-span-8 col-span-12">
                    <SalesOverview />
                </div>
                <div className="lg:col-span-4 col-span-12 flex flex-col gap-6">
                    <YearlyBreakup />
                    <MonthlyEarning />
                </div>
            </div>

            {/* [두 번째 행] 실시간 거래 및 상품 성과 */}
            <div className="grid grid-cols-12 gap-6">
                <div className="lg:col-span-4 col-span-12">
                    <RecentTransaction />
                </div>
                <div className="lg:col-span-8 col-span-12">
                    <ProductPerformance />
                </div>
            </div>

            {/* [세 번째 행] 최고 관리자 전용 직원 성과 (조건부 렌더링) */}
            {userRole === "최고 관리자" && (
                <div className="w-full">
                    <StaffPerformance userRole={userRole} />
                </div>
            )}

            {/* [네 번째 행] 베스트셀러 상품 갤러리 */}
            <div className="w-full">
                <div className="mb-4">
                    <h5 className="text-lg font-bold text-slate-800 dark:text-white">실시간 베스트셀러</h5>
                    <p className="text-sm text-slate-500">현재 가장 많이 팔리고 있는 상품들입니다.</p>
                </div>
                <BestSeller />
            </div>

            {/* 하단 푸터 */}
            <Footer />
        </div>
    );
};

export default DashboardPage;