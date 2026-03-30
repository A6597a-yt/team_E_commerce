"use client"
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import CardBox from "../shared/CardBox";
import { ApexOptions } from 'apexcharts';
import { useTheme } from "next-themes"; // 1. 테마 훅 추가

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const YearlyBreakup = () => {
    const { theme } = useTheme(); // 현재 테마 상태 가져오기

    // 카테고리별 비중 상태 관리 (초기값이자 API 실패 시 Fallback 데이터로 작동)
    const [breakupData, setBreakupData] = useState({
        totalSales: 36358000,
        percentage: 9,
        series: [45, 30, 25], // 비중 (%)
        labels: ["에어소프트건", "장구류", "프라모델"]
    });

    // 2. 여분의 색상을 추가한 차트 컬러 배열 (카테고리가 늘어날 경우 대비)
    const chartColors = ["#5D87FF", "#13DEB9", "#FFAE1F", "#FA896B", "#49BEFF", "#EAEFF4"];

    // 3. 백엔드 API 연동 (실패 시 Fallback 유지)
    useEffect(() => {
        const fetchBreakupData = async () => {
            try {
                // 실제 API 연동 시 아래 주석을 해제하세요.
                // const res = await fetch('/api/admin/dashboard/yearly-breakup');
                // if (!res.ok) throw new Error("Network response was not ok");
                // const data = await res.json();
                // setBreakupData(data);
            } catch (err) {
                console.error("Failed to fetch yearly breakup data. Using fallback data.", err);
                // 에러 발생 시 setBreakupData를 호출하지 않으므로 초기값이 그대로 유지됩니다.
            }
        };
        fetchBreakupData();
    }, []);

    const ChartOptions: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: "inherit",
            // 4. 다크모드/라이트모드 텍스트 색상 자동 전환
            foreColor: theme === 'dark' ? '#adb0bb' : '#333333',
            height: 200,
            toolbar: { show: false },
        },
        labels: breakupData.labels,
        colors: chartColors, // 확장된 컬러 배열 적용
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    background: 'transparent',
                },
            },
        },
        stroke: { show: false },
        dataLabels: { enabled: false },
        legend: { show: false },
        tooltip: {
            // 5. 툴팁 테마 자동 전환
            theme: theme === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
            y: {
                formatter: (val: number) => {
                    return `${val}% (점유율)`;
                }
            }
        },
    };

    return (
        <CardBox className="h-full">
            <div className="grid grid-cols-12 gap-4">
                {/* 왼쪽: 텍스트 정보 영역 */}
                <div className="flex flex-col lg:col-span-7 md:col-span-7 col-span-7">
                    <div>
                        {/* 다크모드 텍스트 대응 클래스(dark:text-white) 추가 */}
                        <h5 className="card-title mb-4 font-bold text-slate-800 dark:text-white">카테고리 판매 비중</h5>
                        <h4 className="text-xl font-black mb-2 text-slate-900 dark:text-white">
                            {breakupData.totalSales.toLocaleString()}원
                        </h4>
                        <div className="flex items-center mb-3 gap-2">
                            <span className="rounded-full p-1 bg-lightsuccess dark:bg-darksuccess flex items-center justify-center ">
                                <Icon icon="tabler:arrow-up-left" className="text-success text-sm" />
                            </span>
                            <p className="text-slate-900 dark:text-white font-bold mb-0">+{breakupData.percentage}%</p>
                            <p className="text-slate-500 text-sm mb-0">전년 대비</p>
                        </div>
                    </div>

                    {/* 6. 커스텀 범례 (Legend) 동적 렌더링 */}
                    <div className="flex flex-col gap-2 mt-4">
                        {breakupData.labels.map((label, index) => (
                            <div className="flex items-center" key={label}>
                                <Icon
                                    icon="tabler:point-filled"
                                    className="text-xl me-1"
                                    // chartColors 배열에서 순서대로 색상을 매핑
                                    style={{ color: chartColors[index % chartColors.length] }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오른쪽: 도넛 차트 영역 */}
                <div className="lg:col-span-5 md:col-span-5 col-span-5 flex items-center justify-center">
                    <Chart
                        options={ChartOptions}
                        series={breakupData.series}
                        type="donut"
                        height={150}
                        width={"100%"}
                    />
                </div>
            </div>
        </CardBox>
    )
}

export { YearlyBreakup }