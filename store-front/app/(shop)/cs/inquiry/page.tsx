'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import api from '@/lib/api';

export default function InquiryCreatePage() {
    const router = useRouter();

    // 폼 상태 관리
    const [category, setCategory] = useState('배송');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 권한 체크 (간단 버전)
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('문의 작성을 위해 로그인이 필요합니다.');
            router.push('/login');
        }
    }, [router]);

    // 이미지 선택 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 용량 제한 (예: 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('파일 크기는 5MB를 초과할 수 없습니다.');
                return;
            }
            setImageFile(file);
            // 미리보기 URL 생성
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    // 이미지 삭제 핸들러
    const removeImage = () => {
        setImageFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return alert('제목과 내용을 입력해주세요.');

        setIsSubmitting(true);

        // ✅ 이미지 포함 전송을 위해 FormData 객체 생성
        const formData = new FormData();
        formData.append('category', category);
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await api.post('/api/inquiries', formData);
            alert('문의가 정상적으로 접수되었습니다.');
            router.push('/mypage/inquiry'); // 작성 후 문의 내역으로 이동
        } catch (error) {
            console.error('문의 등록 실패:', error);
            alert('등록 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">1:1 문의하기</h2>
                <p className="text-slate-500 mt-2">해결되지 않은 궁금증을 남겨주시면 전문가가 답변해 드립니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">

                {/* 문의 유형 선택 */}
                <div>
                    <label className="block text-xs font-black text-slate-400 mb-3 ml-1 uppercase">문의 유형</label>
                    <div className="flex flex-wrap gap-2">
                        {['배송', '상품', '결제/취소', '기타'].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${category === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 제목 입력 */}
                <div>
                    <label className="block text-xs font-black text-slate-400 mb-3 ml-1 uppercase">제목</label>
                    <input
                        type="text"
                        placeholder="제목을 입력해주세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold"
                    />
                </div>

                {/* 내용 입력 */}
                <div>
                    <label className="block text-xs font-black text-slate-400 mb-3 ml-1 uppercase">내용</label>
                    <textarea
                        placeholder="문의하실 내용을 상세히 적어주세요."
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none leading-relaxed"
                    />
                </div>

                {/* 이미지 첨부 섹션 */}
                <div>
                    <label className="block text-xs font-black text-slate-400 mb-3 ml-1 uppercase">이미지 첨부 (1장)</label>

                    {!previewUrl ? (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-2 text-slate-400 hover:bg-slate-50 hover:border-blue-300 transition-all"
                        >
                            <Icon icon="solar:camera-add-bold-duotone" width={32} />
                            <span className="text-sm font-bold">이미지 추가하기</span>
                        </button>
                    ) : (
                        <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black transition-colors"
                            >
                                <Icon icon="solar:close-circle-bold" width={20} />
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-black text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl disabled:bg-slate-300 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? '전송 중...' : '문의 등록하기'}
                    {!isSubmitting && <Icon icon="solar:plain-bold" width={20} />}
                </button>
            </form>
        </div>
    );
}