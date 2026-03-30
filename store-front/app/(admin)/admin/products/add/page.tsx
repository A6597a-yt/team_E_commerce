"use client"
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// 옵션 타입 정의
interface ProductOption {
    id: number;
    name: string;
    extraPrice: number;
    stock: number;
}

const ProductAddPage = () => {
    // --- 상태 관리 ---
    const [formData, setFormData] = useState({
        name: '',
        category: '에어소프트건',
        status: 'SALE',
        originalPrice: 0, // 정가
        salePrice: 0,     // 기준 판매가
        description: '',
    });

    // 동적 옵션 상태 (기본적으로 1개의 빈 옵션 제공)
    const [options, setOptions] = useState<ProductOption[]>([
        { id: Date.now(), name: '', extraPrice: 0, stock: 0 }
    ]);

    // 이미지 상태
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- 이벤트 핸들러 ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 옵션 추가/삭제/변경 핸들러
    const handleAddOption = () => {
        setOptions(prev => [...prev, { id: Date.now(), name: '', extraPrice: 0, stock: 0 }]);
    };

    const handleRemoveOption = (id: number) => {
        if (options.length === 1) {
            alert("최소 1개의 옵션(기본 옵션)은 필요합니다.");
            return;
        }
        setOptions(prev => prev.filter(opt => opt.id !== id));
    };

    const handleOptionChange = (id: number, field: keyof ProductOption, value: string | number) => {
        setOptions(prev => prev.map(opt =>
            opt.id === id ? { ...opt, [field]: value } : opt
        ));
    };

    // 이미지 업로드 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // 폼 제출 핸들러 (Spring Boot MultipartFile 연동)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.salePrice || options.some(opt => !opt.name)) {
            alert("상품명, 판매가, 옵션명 등 필수 항목을 입력해주세요.");
            return;
        }

        try {
            const submitData = new FormData();

            // 1. 상품 정보 JSON 변환 후 FormData에 추가 (Spring @RequestPart("product") 대응)
            const productPayload = {
                ...formData,
                options: options.map(({ name, extraPrice, stock }) => ({ name, extraPrice, stock })) // id 제외
            };

            submitData.append(
                "product",
                new Blob([JSON.stringify(productPayload)], { type: "application/json" })
            );

            // 2. 이미지 파일 추가 (Spring @RequestPart("image") 대응)
            if (imageFile) {
                submitData.append("image", imageFile);
            } else {
                alert("대표 이미지를 등록해주세요.");
                return;
            }

            console.log("전송 데이터 세팅 완료 (API 연동 시 주석 해제)");
            // const response = await fetch('/api/admin/products', {
            //   method: 'POST',
            //   body: submitData, // FormData는 Content-Type을 자동 설정함
            // });
            // if (response.ok) {
            //   alert("상품이 성공적으로 등록되었습니다.");
            //   // 목록 페이지로 이동 로직 추가
            // }

        } catch (error) {
            console.error("상품 등록 실패:", error);
            alert("상품 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {/* 상단 헤더 영역 */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">상품 등록</h2>
                    <p className="text-sm text-slate-500 mt-1">새로운 상품의 상세 정보를 입력해주세요.</p>
                </div>
                <Link href="/admin/products" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    <Icon icon="solar:alt-arrow-left-line-duotone" width={20} />
                    목록으로
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 1. 기본 정보 섹션 */}
                <CardBox>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                        기본 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">상품명 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="예: 고성능 전동건 M4A1"
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">카테고리 <span className="text-red-500">*</span></label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            >
                                <option value="에어소프트건">에어소프트건</option>
                                <option value="장구류">장구류</option>
                                <option value="프라모델">프라모델</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">판매 상태</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            >
                                <option value="SALE">판매중</option>
                                <option value="HIDDEN">숨김 (판매안함)</option>
                                <option value="SOLD_OUT">품절</option>
                            </select>
                        </div>
                    </div>
                </CardBox>

                {/* 2. 이미지 & 가격 섹션 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 대표 이미지 */}
                    <CardBox className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                            대표 이미지 <span className="text-red-500">*</span>
                        </h3>
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-full aspect-square relative rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                {imagePreview ? (
                                    <>
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" width={18} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <Icon icon="solar:gallery-add-line-duotone" className="mx-auto text-slate-400 mb-2" width={32} />
                                        <p className="text-xs text-slate-500">클릭하여 이미지 업로드</p>
                                    </div>
                                )}
                                {/* 투명한 파일 인풋으로 전체 영역 클릭 가능하게 처리 */}
                                {!imagePreview && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                )}
                            </div>
                        </div>
                    </CardBox>

                    {/* 가격 설정 */}
                    <CardBox className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                            가격 설정
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">정가 (소비자가)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">기준 판매가 <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</span>
                                </div>
                            </div>
                        </div>
                    </CardBox>
                </div>

                {/* 3. 상품 옵션 및 재고 섹션 */}
                <CardBox>
                    <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800 mb-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">옵션 및 재고 설정 <span className="text-red-500">*</span></h3>
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md font-medium transition-colors"
                        >
                            + 옵션 추가
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* 테이블 헤더 역할 */}
                        <div className="grid grid-cols-12 gap-4 px-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                            <div className="col-span-5">옵션명 (예: 블랙 S)</div>
                            <div className="col-span-3">추가 금액</div>
                            <div className="col-span-3">재고 수량</div>
                            <div className="col-span-1 text-center">삭제</div>
                        </div>

                        {/* 동적 옵션 리스트 */}
                        {options.map((option) => (
                            <div key={option.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="col-span-5">
                                    <input
                                        type="text"
                                        value={option.name}
                                        onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)}
                                        placeholder="단일 상품일 경우 '기본' 입력"
                                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                                <div className="col-span-3 relative">
                                    <input
                                        type="number"
                                        value={option.extraPrice}
                                        onChange={(e) => handleOptionChange(option.id, 'extraPrice', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white text-right pr-6"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">원</span>
                                </div>
                                <div className="col-span-3 relative">
                                    <input
                                        type="number"
                                        value={option.stock}
                                        onChange={(e) => handleOptionChange(option.id, 'stock', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white text-right pr-6"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">개</span>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(option.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Icon icon="solar:trash-bin-trash-line-duotone" width={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBox>

                {/* 4. 상세 설명 섹션 */}
                <CardBox>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                        상품 상세 설명
                    </h3>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder="상품에 대한 상세한 설명을 입력해주세요."
                        className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none"
                    ></textarea>
                </CardBox>

                {/* 하단 액션 버튼 */}
                <div className="flex justify-end gap-3 mt-2">
                    <Link href="/admin/products" className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        취소
                    </Link>
                    <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30">
                        상품 등록완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductAddPage;