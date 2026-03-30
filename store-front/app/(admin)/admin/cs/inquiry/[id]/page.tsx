"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// --- 타입 정의 ---
interface AttachedImage { id: string; url: string; alt: string; }
interface LinkedOrder { id: number; orderNumber: string; productName: string; amount: number; date: string; status: string; }
interface CustomerInfo { id: number; name: string; userId: string; contact: string; email: string; points: number; }

interface InquiryDetail {
    id: number;
    type: string;
    title: string;
    content: string;
    author: string;
    date: string;
    status: 'WAITING' | 'COMPLETED';
    images: AttachedImage[];
    linkedOrder: LinkedOrder | null;
    customer: CustomerInfo;
    answerContent: string; // 이미 작성된 답변이 있을 경우
}

const macros = [
    { id: 'NONE', label: '직접 입력', content: '' },
    { id: 'DELAY', label: '배송 지연 안내', content: '안녕하세요, 고객님.\n먼저 배송 지연으로 불편을 드려 대단히 죄송합니다.\n주문하신 상품은 물류 센터 사정으로 인해 발송이 지연되고 있으며, [예상 날짜]까지는 꼭 출고될 수 있도록 조치 중입니다.\n조금만 더 기다려 주시면 안전하게 배송해 드리겠습니다. 감사합니다.' },
    { id: 'REFUND', label: '환불 절차 안내', content: '안녕하세요, 고객님.\n상품 파손으로 인해 속상하셨을 텐데 정말 죄송합니다.\n첨부해주신 사진 확인하였으며, 즉시 100% 환불 처리를 진행해 드리겠습니다.\n환불은 결제 수단에 따라 영업일 기준 3~5일 정도 소요될 수 있습니다. 추가 문의가 있으시면 언제든 남겨주세요.' },
];

const InquiryDetailPage = ({ params }: { params: { id: string } }) => {
    // --- 상태 관리 ---
    const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
    const [answerInput, setAnswerInput] = useState('');
    const [selectedMacro, setSelectedMacro] = useState('NONE');

    // 이미지 뷰어 모달 상태
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // --- API 호출 로직 (더미 데이터 세팅) ---
    useEffect(() => {
        // fetch(`/api/admin/cs/inquiries/${params.id}`)
        setInquiry({
            id: Number(params.id),
            type: '교환/환불',
            title: '상품 파손으로 환불 요청합니다.',
            content: '어제 택배 받았는데 열어보니 상품 박스가 완전히 찌그러져 있고 내용물도 파손되어 있습니다.\n첨부한 사진 확인하시고 빠른 환불 처리 부탁드립니다. 너무 실망스럽네요.',
            author: '김철수(iron)',
            date: '2026-03-29 16:40',
            status: 'WAITING',
            images: [
                { id: 'img1', url: 'https://placehold.co/600x400/eeeeee/999999?text=Broken+Box+1', alt: '파손 박스 사진 1' },
                { id: 'img2', url: 'https://placehold.co/600x400/eeeeee/999999?text=Broken+Item+2', alt: '파손 내용물 사진 2' },
            ],
            linkedOrder: { id: 98, orderNumber: 'ORD-20260328-002', productName: '전술 방탄 조끼 멀티캠', amount: 85000, date: '2026-03-28', status: 'DELIVERED' },
            customer: { id: 2, name: '김철수', userId: 'iron', contact: '010-9876-5432', email: 'iron@example.com', points: 2000 },
            answerContent: '',
        });
    }, [params.id]);

    useEffect(() => {
        if (inquiry && inquiry.answerContent) setAnswerInput(inquiry.answerContent);
    }, [inquiry]);

    // --- 이벤트 핸들러 ---
    const handleMacroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const macroId = e.target.value;
        setSelectedMacro(macroId);
        const selected = macros.find(m => m.id === macroId);
        if (selected) setAnswerInput(selected.content);
    };

    const handleSubmitAnswer = () => {
        if (!answerInput.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }
        if (confirm(`답변을 등록하고 고객(${inquiry?.customer.email})에게 알림 이메일을 발송하시겠습니까?`)) {
            setInquiry(prev => prev ? { ...prev, status: 'COMPLETED', answerContent: answerInput } : null);
            alert('답변이 성공적으로 등록되었으며, 고객에게 이메일이 발송되었습니다.');
        }
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
        setIsImageModalOpen(true);
    };

    if (!inquiry) return <div className="p-8 text-center text-slate-500">문의 정보를 불러오는 중...</div>;

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 md:p-8">

            {/* 1. 상단 헤더 */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cs" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon icon="solar:alt-arrow-left-line-duotone" width={24} />
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{inquiry.type}</span>
                            {inquiry.status === 'WAITING'
                                ? <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">답변 대기</span>
                                : <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">답변 완료</span>}
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{inquiry.title}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* 좌측: 문의 내용 및 답변 폼 (2칸 차지) */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* 고객 문의 원본 */}
                    <CardBox className="p-0 overflow-hidden border-t-4 border-slate-300 dark:border-slate-600">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                            <div className="flex items-center gap-3 text-sm">
                                <Icon icon="solar:user-circle-bold-duotone" className="text-slate-400" width={24} />
                                <span className="font-bold text-slate-800 dark:text-white">{inquiry.author}</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500">{inquiry.date}</span>
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                                {inquiry.content}
                            </p>

                            {/* 첨부 이미지 썸네일 렌더링 */}
                            {inquiry.images.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                        <Icon icon="solar:gallery-bold-duotone" width={18} /> 첨부 이미지 ({inquiry.images.length}장)
                                    </p>
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {inquiry.images.map((img) => (
                                            <div
                                                key={img.id}
                                                onClick={() => handleImageClick(img.url)}
                                                className="w-24 h-24 flex-shrink-0 rounded-lg border border-slate-200 cursor-pointer overflow-hidden hover:opacity-80 transition-opacity"
                                            >
                                                {/* 실제 프로젝트에선 next/image 사용 권장 */}
                                                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardBox>

                    {/* 답변 작성 폼 */}
                    <CardBox className="p-6 border-t-4 border-primary shadow-md">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Icon icon="solar:pen-new-square-line-duotone" className="text-primary" width={24} />
                                {inquiry.status === 'WAITING' ? '답변 작성' : '답변 수정'}
                            </h3>

                            {/* 스마트 매크로 드롭다운 */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500">템플릿 불러오기:</span>
                                <select
                                    value={selectedMacro} onChange={handleMacroChange}
                                    className="py-1.5 pl-3 pr-8 text-sm border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-primary bg-white dark:bg-slate-900 shadow-inner"
                                >
                                    {macros.map(macro => (
                                        <option key={macro.id} value={macro.id}>{macro.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <textarea
                            value={answerInput}
                            onChange={(e) => setAnswerInput(e.target.value)}
                            placeholder="고객에게 전달할 답변 내용을 입력하세요. (등록 시 즉각 이메일로 발송됩니다.)"
                            className="w-full h-64 px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 dark:bg-slate-900/50 resize-none shadow-inner mb-4 leading-relaxed"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleSubmitAnswer}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30"
                            >
                                <Icon icon="solar:mailbox-line-duotone" width={20} />
                                {inquiry.status === 'WAITING' ? '답변 등록 및 이메일 발송' : '답변 수정 (재발송)'}
                            </button>
                        </div>
                    </CardBox>

                </div>

                {/* 우측: 고객 및 주문 컨텍스트 패널 (1칸 차지) */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* 연관 주문 컨텍스트 (가장 강조됨) */}
                    {inquiry.linkedOrder && (
                        <CardBox className="p-5 border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10">
                            <h3 className="text-sm font-extrabold text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                <Icon icon="solar:link-bold-duotone" width={18} />
                                이 문의와 연관된 주문
                            </h3>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                <div className="text-xs text-slate-500 mb-1">{inquiry.linkedOrder.date} 결제</div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm mb-2 truncate">
                                    {inquiry.linkedOrder.productName}
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{inquiry.linkedOrder.amount.toLocaleString()}원</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">배송완료</span>
                                </div>
                                <Link href={`/admin/orders/${inquiry.linkedOrder.id}`} className="mt-3 block text-center text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition-colors">
                                    주문 상세 보기
                                </Link>
                            </div>
                        </CardBox>
                    )}

                    {/* 고객 기본 정보 */}
                    <CardBox className="p-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="solar:user-id-line-duotone" className="text-slate-500" width={18} />
                            고객 정보
                        </h3>
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">이름(ID)</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{inquiry.customer.name} ({inquiry.customer.userId})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">연락처</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{inquiry.customer.contact}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 font-medium">이메일</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{inquiry.customer.email}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-1">
                                <span className="text-slate-500 font-medium">보유 적립금</span>
                                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{inquiry.customer.points.toLocaleString()} P</span>
                            </div>
                            <Link href={`/admin/users/${inquiry.customer.id}`} className="mt-2 text-center text-xs text-slate-500 border border-slate-200 hover:border-primary hover:text-primary py-2 rounded-md font-semibold transition-colors">
                                회원 상세 정보 보기
                            </Link>
                        </div>
                    </CardBox>

                </div>
            </div>

            {/* 3. 이미지 확대 모달 (Modal) */}
            {isImageModalOpen && selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={handleCloseImageModal}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex justify-center" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={handleCloseImageModal}
                            className="absolute -top-10 right-0 text-white hover:text-red-400 transition-colors"
                        >
                            <Icon icon="solar:close-circle-bold-duotone" width={36} />
                        </button>
                        <img src={selectedImage} alt="확대된 첨부 이미지" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                    </div>
                </div>
            )}

        </div>
    );

    // 모달 닫기 핸들러 선언 (컴포넌트 내부에 위치)
    function handleCloseImageModal() {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    }
};

export default InquiryDetailPage;