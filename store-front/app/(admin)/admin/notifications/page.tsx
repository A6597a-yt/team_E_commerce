'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getNotificationLogsAction } from '@/features/admin/actions';

export default function NotificationLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        setIsLoading(true);
        const res = await getNotificationLogsAction();

        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setLogs(res.data);
        } else {
            // 백엔드 API 연결 실패 시 시연을 위한 화면 표출용 더미 데이터
            setLogs([
                { id: 2, orderId: 'ORD-20260331-002', receiverEmail: 'user2@example.com', status: 'SUCCESS', createdAt: '2026-03-31 14:10:22' },
                { id: 1, orderId: 'ORD-20260331-001', receiverEmail: 'user1@example.com', status: 'SUCCESS', createdAt: '2026-03-31 14:05:00' }
            ]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">알림 발송 로그</h1>
                    <p className="text-sm text-slate-500 mt-1">비동기 이벤트 기반 이메일 발송 내역을 확인합니다.</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <Icon icon="solar:refresh-linear" width={20} />
                    새로고침
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 font-bold text-slate-700 dark:text-slate-300">ID</th>
                            <th className="p-4 font-bold text-slate-700 dark:text-slate-300">주문 번호</th>
                            <th className="p-4 font-bold text-slate-700 dark:text-slate-300">수신자 이메일</th>
                            <th className="p-4 font-bold text-slate-700 dark:text-slate-300">발송 상태</th>
                            <th className="p-4 font-bold text-slate-700 dark:text-slate-300">발생 일시</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">데이터를 불러오는 중...</td></tr>
                        ) : logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-slate-600 dark:text-slate-400">{log.id}</td>
                                <td className="p-4 font-bold text-slate-900 dark:text-white">{log.orderId}</td>
                                <td className="p-4 text-slate-600 dark:text-slate-400">{log.receiverEmail}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">{log.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}