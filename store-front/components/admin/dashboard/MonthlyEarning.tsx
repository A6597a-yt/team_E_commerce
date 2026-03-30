"use client"
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import CardBox from "../shared/CardBox";
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MonthlyEarning = () => {
    // 1. 실무용 상태 관리 (초기값은 에어소프트 쇼핑몰 가상 데이터)
    const [earningData, setEarningData] = useState({
        total: 6820000,
        percentage: 9,
        series: [450000, 520000, 480000, 600000, 550000, 720000, 680000]
    });

    // 백엔드 연동 뼈대
    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                // const res = await fetch('/api/admin/dashboard/monthly-earning');
                // const data = await res.json();
                // setEarningData(data);
            } catch (err) {
                console.error("Failed to fetch monthly earnings", err);
            }
        };
        fetchMonthlyData();
    }, []);

    const ChartOptions: ApexOptions = {
        chart: {
            id: "monthly-earning-chart",
            type: "area",
            height: 60,
            sparkline: { enabled: true },
            group: 'sparklines',
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.2,
                opacityTo: 0,
                stops: [20, 180],
            },
        },
        markers: { size: 0 },
        tooltip: {
            theme: "dark",
            fixed: { enabled: true, position: "right" },
            x: { show: false },
            y: {
                formatter: (val: number) => {
                    return `${val.toLocaleString()} 원`;
                }
            }
        },
        colors: ["#13DEB9"], // 성공/성장을 의미하는 그린 계열
    };

    return (
        <CardBox className="p-0! mt-0 bg-white dark:bg-dark-card overflow-hidden">
            <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="card-title mb-0 font-semibold">이번 달 매출액</h5>
                    <div className="text-white bg-secondary rounded-full h-11 w-11 flex items-center justify-center shadow-sm">
                        <Icon icon='tabler:briefcase' className="text-xl" />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 mb-4">
                    <div className="col-span-12">
                        {/* 금액 포맷팅 적용 */}
                        <h4 className="text-2xl font-bold mb-3">
                            {earningData.total.toLocaleString()}원
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full p-1 bg-lightsuccess dark:bg-darksuccess flex items-center justify-center ">
                                <Icon icon='tabler:arrow-up-right' className="text-success" />
                            </span>
                            <p className="text-slate-900 dark:text-white font-semibold mb-0">
                                +{earningData.percentage}%
                            </p>
                            <p className="text-slate-500 mb-0 text-sm">전년 대비</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 스파크라인 차트 */}
            <Chart
                options={ChartOptions}
                series={[{ name: '매출 추이', data: earningData.series }]}
                type="area"
                height={70}
                width={"100%"}
            />
        </CardBox>
    );
};

export { MonthlyEarning };