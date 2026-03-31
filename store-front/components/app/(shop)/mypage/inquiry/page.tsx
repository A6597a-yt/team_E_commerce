'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import api from '@/lib/api';

export default function InquiryHistoryPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);

    useEffect(() => {
        api.get('/api/inquiries').then(res => setInquiries(res.data));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">1:1 문의 내역</h2>
                    <p className="text-sm text-slate-500 mt-1">문의하신 내용과 답변을 확인하실 수 있습니다.</p>
                </div>
                <Link href="/cs/inquiry" className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all">
                    새 문의 작성
                </Link>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                {inquiries.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {inquiries.map((iq) => (
                            <div key={iq.id} className="flex flex-col">
                                <button
                                    onClick={() => setOpenId(openId === iq.id ? null : iq.id)}
                                    className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-bold text-slate-400">{iq.createdAt}</span>
                                        <span className="text-sm font-bold text-slate-800">{iq.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${iq.status === 'ANSWERED' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {iq.status === 'ANSWERED' ? '답변완료' : '답변대기'}
                                        </span>
                                        <Icon icon={openId === iq.id ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="text-slate-300" />
                                    </div>
                                </button>

                                {openId === iq.id && (
                                    <div className="px-6 pb-6 pt-2 bg-slate-50/50 space-y-4">
                                        <div className="p-4 bg-white border border-slate-100 rounded-2xl text-sm text-slate-600">
                                            <p className="font-bold text-slate-400 mb-2 text-[11px] uppercase">내 문의 내용</p>
                                            배송이 너무 늦어지는데 언제쯤 받을 수 있을까요? (Mock Data)
                                        </div>
                                        {iq.status === 'ANSWERED' && (
                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-900">
                                                <p className="font-bold text-blue-400 mb-2 text-[11px] uppercase">관리자 답변</p>
                                                안녕하세요 대원님! 현재 물량 폭주로 인해 순차 발송 중입니다. 조금만 더 기다려주세요!
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-400">문의 내역이 없습니다.</div>
                )}
            </div>
        </div>
    );
}