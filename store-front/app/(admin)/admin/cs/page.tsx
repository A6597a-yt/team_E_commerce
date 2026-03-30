"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// --- 타입 정의 ---
type TabType = 'INQUIRY' | 'QA' | 'NOTICE' | 'FAQ';

interface Inquiry { id: number; type: string; title: string; author: string; date: string; status: 'WAITING' | 'COMPLETED'; }
interface Qna { id: number; productName: string; title: string; author: string; date: string; status: 'WAITING' | 'COMPLETED'; }
interface Notice { id: number; isPinned: boolean; title: string; author: string; date: string; views: number; isVisible: boolean; }
interface Faq { id: number; category: string; question: string; isVisible: boolean; }

const CsManagementPage = () => {
    // --- 상태 관리 ---
    const [activeTab, setActiveTab] = useState<TabType>('INQUIRY');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 데이터 상태
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [qnas, setQnas] = useState<Qna[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [faqs, setFaqs] = useState<Faq[]>([]);

    // 필터 상태
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // --- API 호출 로직 (더미 데이터 세팅) ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setInquiries([
                { id: 1, type: '배송 문의', title: '언제 배송되나요?', author: '홍길동(hong123)', date: '2026-03-30 09:15', status: 'WAITING' },
                { id: 2, type: '교환/환불', title: '상품 파손으로 환불 요청합니다.', author: '김철수(iron)', date: '2026-03-29 16:40', status: 'WAITING' },
                { id: 3, type: '기타', title: '회원 탈퇴는 어떻게 하나요?', author: '이영희(young)', date: '2026-03-28 11:20', status: 'COMPLETED' },
            ]);
            setQnas([
                { id: 101, productName: '전술 방탄 조끼 멀티캠', title: '사이즈가 어떻게 되나요?', author: '박지성(park)', date: '2026-03-30 10:05', status: 'WAITING' },
                { id: 102, productName: '고성능 전동건 M4A1', title: '배터리 포함인가요?', author: '최동원(choi)', date: '2026-03-25 14:30', status: 'COMPLETED' },
            ]);
            setNotices([
                { id: 501, isPinned: true, title: '[필독] 설 연휴 배송 및 고객센터 휴무 안내', author: '관리자', date: '2026-01-20', views: 1250, isVisible: true },
                { id: 502, isPinned: false, title: '봄맞이 신상품 입고 안내', author: '관리자', date: '2026-03-01', views: 342, isVisible: true },
                { id: 503, isPinned: false, title: '시스템 점검 안내 (완료)', author: '관리자', date: '2026-02-15', views: 89, isVisible: false },
            ]);
            setFaqs([
                { id: 901, category: '배송/포장', question: '오후 몇 시까지 결제해야 당일 발송되나요?', isVisible: true },
                { id: 902, category: '교환/환불', question: '단순 변심으로 인한 교환 배송비는 얼마인가요?', isVisible: true },
                { id: 903, category: '주문/결제', question: '현금영수증 발행은 어떻게 하나요?', isVisible: true },
                { id: 904, category: '회원/적립금', question: '적립금은 언제 소멸되나요?', isVisible: true },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    // --- 탭 전환 핸들러 ---
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setStatusFilter('ALL');
        setCategoryFilter('ALL');
    };

    // --- 요약 통계 데이터 동적 생성 ---
    const getSummaryCards = () => {
        switch (activeTab) {
            case 'INQUIRY':
                return [
                    { label: '전체 1:1 문의', value: inquiries.length, icon: 'solar:letter-line-duotone', textColor: 'text-blue-600', borderColor: 'border-blue-600' },
                    { label: '답변 대기', value: inquiries.filter(i => i.status === 'WAITING').length, icon: 'solar:danger-circle-line-duotone', textColor: 'text-red-600', borderColor: 'border-red-600' },
                    { label: '답변 완료', value: inquiries.filter(i => i.status === 'COMPLETED').length, icon: 'solar:check-circle-line-duotone', textColor: 'text-emerald-600', borderColor: 'border-emerald-600' },
                ];
            case 'QA':
                return [
                    { label: '전체 상품 Q&A', value: qnas.length, icon: 'solar:box-minimalistic-line-duotone', textColor: 'text-indigo-600', borderColor: 'border-indigo-600' },
                    { label: '답변 대기', value: qnas.filter(q => q.status === 'WAITING').length, icon: 'solar:danger-circle-line-duotone', textColor: 'text-red-600', borderColor: 'border-red-600' },
                    { label: '답변 완료', value: qnas.filter(q => q.status === 'COMPLETED').length, icon: 'solar:check-circle-line-duotone', textColor: 'text-emerald-600', borderColor: 'border-emerald-600' },
                ];
            case 'NOTICE':
                return [
                    { label: '전체 공지사항', value: notices.length, icon: 'solar:bell-line-duotone', textColor: 'text-primary', borderColor: 'border-primary' },
                    { label: '상단 고정됨', value: notices.filter(n => n.isPinned).length, icon: 'solar:pin-bold-duotone', textColor: 'text-amber-600', borderColor: 'border-amber-600' },
                    { label: '숨김 처리됨', value: notices.filter(n => !n.isVisible).length, icon: 'solar:eye-closed-line-duotone', textColor: 'text-slate-500', borderColor: 'border-slate-500' },
                ];
            case 'FAQ':
                return [
                    { label: '등록된 FAQ', value: faqs.length, icon: 'solar:question-circle-line-duotone', textColor: 'text-primary', borderColor: 'border-primary' },
                    { label: '배송/교환 관련', value: faqs.filter(f => f.category.includes('배송') || f.category.includes('교환')).length, icon: 'solar:box-minimalistic-line-duotone', textColor: 'text-blue-600', borderColor: 'border-blue-600' },
                    { label: '숨김 처리됨', value: faqs.filter(f => !f.isVisible).length, icon: 'solar:eye-closed-line-duotone', textColor: 'text-slate-500', borderColor: 'border-slate-500' },
                ];
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-full mx-auto p-4 md:p-8">

            {/* 1. 상단 헤더 */}
            <div className="mb-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">통합 고객 센터 (CS)</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 mt-2">고객의 1:1 문의, 상품 Q&A, 공지사항 및 FAQ를 종합적으로 관리합니다.</p>
            </div>

            {/* 2. 탭 네비게이션 */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
                {[
                    { id: 'INQUIRY', label: '1:1 문의 관리', icon: 'solar:user-speak-line-duotone' },
                    { id: 'QA', label: '상품 Q&A 관리', icon: 'solar:box-minimalistic-line-duotone' },
                    { id: 'NOTICE', label: '공지사항 관리', icon: 'solar:bell-bing-line-duotone' },
                    { id: 'FAQ', label: 'FAQ 관리', icon: 'solar:question-square-line-duotone' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as TabType)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Icon icon={tab.icon} width={20} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 3. 동적 요약 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSummaryCards().map((stat) => (
                    <CardBox key={stat.label} className={`p-6 flex items-center justify-between border-t-4 ${stat.borderColor} shadow-sm`}>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <h4 className={`text-3xl font-extrabold mt-2 text-slate-900 dark:text-white`}>{stat.value}건</h4>
                        </div>
                        <div className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800`}>
                            <Icon icon={stat.icon} className={stat.textColor} width={32} />
                        </div>
                    </CardBox>
                ))}
            </div>

            {/* 4. 메인 데이터 영역 */}
            <CardBox className="p-6 md:p-8">

                {/* 툴바 (필터 및 액션 버튼) */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        {activeTab === 'NOTICE' && (
                            <button className="flex items-center gap-2 text-sm bg-primary text-white hover:bg-primary/90 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
                                <Icon icon="solar:pen-new-square-line-duotone" width={18} /> 공지사항 등록
                            </button>
                        )}
                        {activeTab === 'FAQ' && (
                            <button className="flex items-center gap-2 text-sm bg-primary text-white hover:bg-primary/90 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
                                <Icon icon="solar:pen-new-square-line-duotone" width={18} /> FAQ 등록
                            </button>
                        )}
                        {(activeTab === 'INQUIRY' || activeTab === 'QA') && (
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                답변 등록 시 이메일 자동 발송
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        {(activeTab === 'INQUIRY' || activeTab === 'QA') && (
                            <select
                                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                className="py-2.5 px-4 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-slate-900 shadow-inner"
                            >
                                <option value="ALL">상태 전체보기</option>
                                <option value="WAITING">답변 대기</option>
                                <option value="COMPLETED">답변 완료</option>
                            </select>
                        )}
                        {activeTab === 'FAQ' && (
                            <select
                                value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                                className="py-2.5 px-4 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-slate-900 shadow-inner"
                            >
                                <option value="ALL">카테고리 전체</option>
                                <option value="배송/포장">배송/포장</option>
                                <option value="교환/환불">교환/환불</option>
                                <option value="주문/결제">주문/결제</option>
                                <option value="회원/적립금">회원/적립금</option>
                            </select>
                        )}
                    </div>
                </div>

                {/* 테이블 영역 */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                <th className="p-4 w-12 text-center"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" /></th>

                                {/* 탭별 동적 헤더 */}
                                {activeTab === 'INQUIRY' && <><th className="p-4 w-32">문의 유형</th><th className="p-4 w-auto">제목</th><th className="p-4 w-40">작성자</th><th className="p-4 w-36 text-center">작성일</th><th className="p-4 w-28 text-center">상태</th><th className="p-4 w-24 text-center">관리</th></>}
                                {activeTab === 'QA' && <><th className="p-4 w-56">상품명</th><th className="p-4 w-auto">질문 제목</th><th className="p-4 w-32">작성자</th><th className="p-4 w-36 text-center">작성일</th><th className="p-4 w-28 text-center">상태</th><th className="p-4 w-24 text-center">관리</th></>}
                                {activeTab === 'NOTICE' && <><th className="p-4 w-24 text-center">번호</th><th className="p-4 w-auto">제목</th><th className="p-4 w-32">작성자</th><th className="p-4 w-32 text-center">등록일</th><th className="p-4 w-24 text-center">조회수</th><th className="p-4 w-28 text-center">노출 여부</th><th className="p-4 w-24 text-center">관리</th></>}
                                {activeTab === 'FAQ' && <><th className="p-4 w-32">카테고리</th><th className="p-4 w-auto">질문 (Q)</th><th className="p-4 w-28 text-center">노출 여부</th><th className="p-4 w-24 text-center">관리</th></>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-500">데이터를 불러오는 중입니다...</td></tr>
                            ) : (
                                <>
                                    {/* 1:1 문의 데이터 */}
                                    {activeTab === 'INQUIRY' && inquiries.map(item => (
                                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-center"><input type="checkbox" className="w-4 h-4 rounded" /></td>
                                            <td className="p-4 text-sm font-medium text-slate-600">{item.type}</td>
                                            <td className="p-4 font-bold text-slate-900 dark:text-white truncate">{item.title}</td>
                                            <td className="p-4 text-sm text-slate-600">{item.author}</td>
                                            <td className="p-4 text-xs text-center text-slate-500">{item.date}</td>
                                            <td className="p-4 text-center">
                                                {item.status === 'WAITING' ? <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-700">답변 대기</span> : <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600">답변 완료</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link href={`/admin/cs/inquiry/${item.id}`} className="text-xs bg-white text-slate-600 hover:text-primary border border-slate-200 px-3 py-1.5 rounded-md font-semibold transition-colors shadow-sm">상세</Link>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* 상품 Q&A 데이터 */}
                                    {activeTab === 'QA' && qnas.map(item => (
                                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-center"><input type="checkbox" className="w-4 h-4 rounded" /></td>
                                            <td className="p-4 text-xs text-slate-500 truncate max-w-[200px]">{item.productName}</td>
                                            <td className="p-4 font-bold text-slate-900 dark:text-white truncate">{item.title}</td>
                                            <td className="p-4 text-sm text-slate-600">{item.author}</td>
                                            <td className="p-4 text-xs text-center text-slate-500">{item.date}</td>
                                            <td className="p-4 text-center">
                                                {item.status === 'WAITING' ? <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-700">답변 대기</span> : <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600">답변 완료</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link href={`/admin/cs/qa/${item.id}`} className="text-xs bg-white text-slate-600 hover:text-primary border border-slate-200 px-3 py-1.5 rounded-md font-semibold transition-colors shadow-sm">상세</Link>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* 공지사항 데이터 (상단 고정 반영) */}
                                    {activeTab === 'NOTICE' && notices.sort((a, b) => Number(b.isPinned) - Number(a.isPinned)).map(item => (
                                        <tr key={item.id} className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 transition-colors ${item.isPinned ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                                            <td className="p-4 text-center"><input type="checkbox" className="w-4 h-4 rounded" /></td>
                                            <td className="p-4 text-center">
                                                {item.isPinned ? <span className="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700">공지</span> : <span className="text-sm text-slate-500">{item.id}</span>}
                                            </td>
                                            <td className={`p-4 font-bold ${item.isPinned ? 'text-amber-900 dark:text-amber-400' : 'text-slate-900 dark:text-white'} truncate`}>{item.title}</td>
                                            <td className="p-4 text-sm text-slate-600">{item.author}</td>
                                            <td className="p-4 text-xs text-center text-slate-500">{item.date}</td>
                                            <td className="p-4 text-xs text-center text-slate-500">{item.views.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                {item.isVisible ? <span className="text-xs font-bold text-emerald-600">노출 중</span> : <span className="text-xs font-bold text-slate-400">숨김</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link href={`/admin/cs/notice/${item.id}`} className="text-xs bg-white text-slate-600 hover:text-primary border border-slate-200 px-3 py-1.5 rounded-md font-semibold transition-colors shadow-sm">수정</Link>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* FAQ 데이터 */}
                                    {activeTab === 'FAQ' && faqs.map(item => (
                                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-center"><input type="checkbox" className="w-4 h-4 rounded" /></td>
                                            <td className="p-4 text-sm font-bold text-indigo-600 dark:text-indigo-400">[{item.category}]</td>
                                            <td className="p-4 font-bold text-slate-900 dark:text-white leading-snug">{item.question}</td>
                                            <td className="p-4 text-center">
                                                {item.isVisible ? <span className="text-xs font-bold text-emerald-600">노출 중</span> : <span className="text-xs font-bold text-slate-400">숨김</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link href={`/admin/cs/faq/${item.id}`} className="text-xs bg-white text-slate-600 hover:text-primary border border-slate-200 px-3 py-1.5 rounded-md font-semibold transition-colors shadow-sm">수정</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardBox>
        </div>
    );
};

export default CsManagementPage;