"use client"
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { ApexOptions } from 'apexcharts';
import CardBox from '../shared/CardBox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = () => {
    const [selectedYear, setSelectedYear] = useState("2026년");
    const [loading, setLoading] = useState(false);

    // 1. 장난감 카테고리에 맞춘 더미 데이터 (추후 API 연동 시 State로 관리)
    const chartDataByYear: Record<string, any> = {
        "2026년": {
            series: [
                { name: "에어소프트건", data: [550000, 720000, 610000, 890000, 450000, 600000, 740000, 940000, 820000, 930000, 740000, 810000] },
                { name: "장구류", data: [200000, 310000, 250000, 450000, 260000, 380000, 320000, 530000, 490000, 530000, 320000, 450000] },
                { name: "프라모델", data: [150000, 220000, 180000, 300000, 150000, 200000, 240000, 340000, 280000, 330000, 240000, 310000] },
            ],
        },
        "2025년": {
            series: [
                { name: "에어소프트건", data: [450000, 520000, 410000, 690000, 350000, 500000, 640000, 840000, 720000, 830000, 640000, 710000] },
                { name: "장구류", data: [180000, 210000, 200000, 350000, 210000, 280000, 220000, 430000, 390000, 430000, 220000, 350000] },
                { name: "프라모델", data: [120000, 180000, 150000, 250000, 120000, 160000, 180000, 280000, 220000, 270000, 180000, 250000] },
            ],
        }
    };

    // 연도 변경 시 Spring Boot API 호출 뼈대
    useEffect(() => {
        const fetchSalesData = async () => {
            setLoading(true);
            try {
                // await fetch(`/api/admin/dashboard/sales?year=${selectedYear.replace('년', '')}`);
            } catch (error) {
                console.error("Sales data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSalesData();
    }, [selectedYear]);

    const baseChartOptions: ApexOptions = {
        chart: {
            toolbar: { show: false },
            type: "bar",
            fontFamily: "inherit",
            foreColor: "#7C8FAC",
            stacked: true,
            width: "100%",
        },
        colors: ["#5D87FF", "#13DEB9", "#FFAE1F"],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "30%",
                borderRadius: 4,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
            },
        },
        dataLabels: { enabled: false },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            markers: {
                size: 6,
                strokeWidth: 0,
                shape: 'circle',
            },
            // 항목 간의 간격을 조절하고 싶다면 itemMargin을 사용.
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        grid: {
            borderColor: "rgba(0,0,0,0.1)",
            strokeDashArray: 3,
        },
        xaxis: {
            categories: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (val: number) => {
                    return val >= 10000 ? `${(val / 10000).toLocaleString()}만원` : `${val.toLocaleString()}원`;
                }
            }
        },
        tooltip: {
            theme: "dark",
            y: {
                formatter: (val: number) => {
                    return `${val.toLocaleString()} 원`;
                }
            }
        },
    };

    return (
        <CardBox className='pb-0 h-full w-full bg-white dark:bg-dark-card'>
            <div className="sm:flex items-center justify-between mb-6">
                <div>
                    <h5 className="card-title text-lg font-bold">월별 카테고리 매출 현황</h5>
                    <p className='card-subtitle text-slate-500'>에어소프트건 / 장구류 / 프라모델 통계</p>
                </div>
                <div className="sm:mt-0 mt-4">
                    <Select
                        value={selectedYear}
                        onValueChange={(val: any) => setSelectedYear(val)}
                    >
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="연도 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2026년">2026년</SelectItem>
                            <SelectItem value="2025년">2025년</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className={loading ? "opacity-50 transition-opacity" : "opacity-100"}>
                <Chart
                    options={baseChartOptions}
                    series={chartDataByYear[selectedYear]?.series || []}
                    type="bar"
                    height="320px"
                    width={"100%"}
                />
            </div>
        </CardBox>
    );
};

export default SalesOverview;