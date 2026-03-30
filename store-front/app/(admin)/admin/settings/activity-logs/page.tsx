"use client"
import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox'; // 경로 확인 필요
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- 임시 데이터 (나중에 Spring Boot API에서 가져올 부분) ---
const logs = [
    { id: 1, time: '2026-03-30 15:30:12', adminId: 'admin_master', action: '상품 [VFC M4A1] 재고 수정', detail: '+50개', ip: '192.168.1.5' },
    { id: 2, time: '2026-03-30 14:22:05', adminId: 'md_tiger', action: '사이트 점검 모드 활성화', detail: '서버 정기 점검', ip: '112.150.xx.xx' },
    { id: 3, time: '2026-03-30 11:05:44', adminId: 'admin_master', action: '신규 카테고리 추가', detail: '[광학장비]', ip: '192.168.1.5' },
];

export default function ActivityLogsPage() {
    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto p-4 md:p-8 relative">

            {/* 1. 상단 헤더 (우리가 맞춘 넉넉한 여백 레이아웃) */}
            <div className="sticky top-0 z-10 bg-slate-50/90 dark:bg-[#0B0A26]/90 backdrop-blur-md py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">관리자 활동 이력</h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-1">시스템 내에서 발생한 모든 관리자 작업 로그를 모니터링합니다.</p>
                </div>
                {/* 로그 다운로드 등 추가 기능 버튼 자리 */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">
                    <Icon icon="solar:download-bold-duotone" width={18} />
                    엑셀 추출
                </button>
            </div>

            {/* 2. 메인 로그 테이블 구역 */}
            <CardBox className="p-0 overflow-hidden border-t-4 border-slate-700 shadow-sm bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead className="w-[180px] font-bold">발생 일시</TableHead>
                                <TableHead className="w-[150px] font-bold">관리자 ID</TableHead>
                                <TableHead className="font-bold">활동 내용</TableHead>
                                <TableHead className="w-[150px] font-bold text-right pr-6">IP 주소</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800">
                                    <TableCell className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                        {log.time}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                <Icon icon="solar:user-bold" className="text-slate-500" width={14} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{log.adminId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{log.action}</span>
                                            <span className="text-xs text-slate-500">{log.detail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                                            {log.ip}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* 하단 페이지네이션 (예시) */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                    <p className="text-xs text-slate-400 italic">로그 데이터는 보안 정책에 따라 최대 1년간 보관됩니다.</p>
                </div>
            </CardBox>
        </div>
    );
}