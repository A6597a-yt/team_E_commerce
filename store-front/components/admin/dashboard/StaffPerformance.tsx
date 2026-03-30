"use client"
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import CardBox from "../shared/CardBox";
import { Badge } from "../../ui/badge";

// 1. 컴포넌트가 받을 Props 타입 (현재 로그인한 유저의 권한 포함)
interface StaffPerformanceProps {
  userRole: string; // '최고 관리자' 또는 '일반 관리자'
}

export const StaffPerformance = ({ userRole }: StaffPerformanceProps) => {
  
  // 2. 권한 체크: 최고 관리자가 아니면 아예 렌더링하지 않음
  if (userRole !== "최고 관리자") {
    return null; 
  }

  const StaffData = [
    { key: "s1", name: "홍길동", dept: "물류/배송팀", orders: 152, csRate: "98%", grade: "S", color: "bg-amber-100 text-amber-700" },
    { key: "s2", name: "김철수", dept: "CS지원팀", orders: 45, csRate: "95%", grade: "A", color: "bg-emerald-100 text-emerald-700" },
    { key: "s3", name: "이영희", dept: "상품소싱팀", orders: 88, csRate: "92%", grade: "A", color: "bg-emerald-100 text-emerald-700" },
    { key: "s4", name: "박민수", dept: "물류/배송팀", orders: 110, csRate: "85%", grade: "B", color: "bg-blue-100 text-blue-700" },
    { key: "s5", name: "최지우", dept: "마케팅팀", orders: 30, csRate: "80%", grade: "C", color: "bg-slate-100 text-slate-600" },
  ];

  return (
    <CardBox className="border-2 border-amber-100 shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h5 className="card-title text-lg font-bold text-slate-800">직원별 업무 성과 리포트</h5>
          <p className="text-sm text-slate-500">최고 관리자 전용 권한 데이터입니다.</p>
        </div>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">매니지먼트 모드</Badge>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold text-slate-700">성함</TableHead>
              <TableHead className="font-bold text-slate-700">소속 부서</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">주문 처리</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">CS 해결률</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">성과 등급</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {StaffData.map((staff) => (
              <TableRow key={staff.key} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-bold text-slate-800">{staff.name}</TableCell>
                <TableCell className="text-slate-600">{staff.dept}</TableCell>
                <TableCell className="text-center font-medium">{staff.orders}건</TableCell>
                <TableCell className="text-center font-medium">{staff.csRate}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full w-8 h-8 flex items-center justify-center p-0 border-transparent font-black ${staff.color}`}>
                    {staff.grade}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardBox>
  );
};