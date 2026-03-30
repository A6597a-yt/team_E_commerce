"use client"
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"; // 상대 경로 확인
import CardBox from "../shared/CardBox";
import { Badge } from "../../ui/badge"; // 상대 경로 확인

export const ProductPerformance = () => {
  // 1. 실제 상품 성과 데이터로 교체 (초기값)
  const [performanceData, setPerformanceData] = useState([
    {
      key: "prod1",
      name: "VFC M4A1 RIS GBB",
      category: "에어소프트건",
      status: "인기",
      statusColor: "bg-emerald-100 text-emerald-800",
      sales: 12450000
    },
    {
      key: "prod2",
      name: "JPC 2.0 타입 플레이트 캐리어",
      category: "장구류",
      status: "판매중",
      statusColor: "bg-blue-100 text-blue-800",
      sales: 8900000
    },
    {
      key: "prod3",
      name: "아카데미 타이거 I 프라모델",
      category: "프라모델",
      status: "재고부족",
      statusColor: "bg-amber-100 text-amber-800",
      sales: 3200000
    },
    {
      key: "prod4",
      name: "Eotech 타입 도트사이트",
      category: "장구류",
      status: "품절",
      statusColor: "bg-slate-100 text-slate-600",
      sales: 5400000
    },
    {
      key: "prod5",
      name: "Glock 17 Gen5 GBB",
      category: "에어소프트건",
      status: "신규",
      statusColor: "bg-purple-100 text-purple-800",
      sales: 2100000
    },
  ]);

  // 백엔드 API 연동 뼈대
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        // const res = await fetch('/api/admin/dashboard/performance');
        // const data = await res.json();
        // setPerformanceData(data);
      } catch (err) {
        console.error("Failed to fetch performance data", err);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <CardBox>
      <div id="product" className="mb-6">
        <div>
          <h5 className="card-title text-lg font-bold">상품별 판매 성과</h5>
          <p className="text-sm text-slate-500">카테고리별 누적 판매 실적 상위 5개</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="text-sm font-semibold w-16">순위</TableHead>
                    <TableHead className="text-sm font-semibold">상품 정보</TableHead>
                    <TableHead className="text-sm font-semibold">카테고리</TableHead>
                    <TableHead className="text-sm font-semibold">상태</TableHead>
                    <TableHead className="text-sm font-semibold text-right">총 매출액</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {performanceData.map((item, index) => (
                    <TableRow key={item.key} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <p className="text-slate-500 font-bold text-sm">{index + 1}</p>
                      </TableCell>

                      <TableCell className="ps-0 min-w-[200px]">
                        <div>
                          <h6 className="text-sm font-bold text-slate-800 mb-0.5">{item.name}</h6>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-slate-600 font-medium text-sm">
                          {item.category}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[12px] px-2.5 rounded-md border-transparent font-semibold ${item.statusColor}`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <p className="text-slate-900 text-[14px] font-bold">
                          {item.sales.toLocaleString()}원
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </CardBox>
  )
}