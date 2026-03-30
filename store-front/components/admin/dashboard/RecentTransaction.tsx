"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
// 상대 경로를 유지하여 경로 에러를 방지합니다.
import CardBox from "../shared/CardBox"

export const RecentTransaction = () => {
    // 1. 실시간 거래 현황 상태 관리 (초기값은 에어소프트 쇼핑몰 시나리오)
    const [transactions, setTransactions] = useState([
        {
            key: "timeline1",
            time: "09:30",
            desc: "김철수 님 결제 완료 (585,000원)",
            isSale: false,
            borderColor: "border-primary",
            isLastItem: false,
        },
        {
            key: "timeline2",
            time: "10:00",
            desc: "신규 주문 접수",
            orderNo: "#ORD-202603-7829",
            isSale: true,
            borderColor: "border-info",
            isLastItem: false,
        },
        {
            key: "timeline3",
            time: "12:00",
            desc: "입고 알림: 타이거 탱크 프라모델 (50개)",
            isSale: false,
            borderColor: "border-success",
            isLastItem: false,
        },
        {
            key: "timeline4",
            time: "14:30",
            desc: "신규 주문 접수",
            orderNo: "#ORD-202603-7830",
            isSale: true,
            borderColor: "border-warning",
            isLastItem: false,
        },
        {
            key: "timeline5",
            time: "16:00",
            desc: "이영희 님 환불 요청 접수",
            isSale: false,
            borderColor: "border-error",
            isLastItem: false,
        },
        {
            key: "timeline6",
            time: "18:00",
            desc: "배송 시작: 전술 플레이트 캐리어 (외 2건)",
            isSale: false,
            borderColor: "border-success",
            isLastItem: true,
        },
    ]);

    // 백엔드 API 연동 뼈대
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // const res = await fetch('/api/admin/dashboard/recent-transactions');
                // const data = await res.json();
                // setTransactions(data);
            } catch (err) {
                console.error("Failed to fetch transactions", err);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <CardBox className="h-full w-full bg-white dark:bg-dark-card">
            <div className="flex flex-col gap-1.5">
                <h5 className="card-title text-lg font-bold">최근 거래 내역</h5>
                <p className="card-subtitle text-slate-500">실시간 주문 및 결제 현황</p>
            </div>
            <div className="mt-6">
                {
                    transactions.map((item) => {
                        return (
                            <div key={item.key} className="flex gap-x-3">
                                {/* 시간 표시 영역 */}
                                <div className="w-1/4 text-end">
                                    <span className="font-medium text-slate-600 dark:text-slate-400 text-sm">
                                        {item.time}
                                    </span>
                                </div>

                                {/* 타임라인 선 및 원형 아이콘 영역 */}
                                <div className={`relative ${item.isLastItem ? "after:hidden" : ""} after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-slate-200 dark:after:bg-slate-700`}>
                                    <div className="relative z-1 w-7 h-7 flex justify-center items-center">
                                        <div className={`h-3 w-3 rounded-full bg-transparent border-2 ${item.borderColor}`}></div>
                                    </div>
                                </div>

                                {/* 설명 및 링크 영역 */}
                                <div className="w-1/4 grow pt-0.5 pb-6">
                                    {!item.isSale ? (
                                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                                            {item.desc}
                                        </p>
                                    ) : (
                                        <div className="flex flex-col">
                                            <h6 className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                                                {item.desc}
                                            </h6>
                                            <Link href={`/admin/orders/${item.orderNo}`} className="text-primary text-sm font-semibold hover:underline">
                                                {item.orderNo}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </CardBox>
    )
}