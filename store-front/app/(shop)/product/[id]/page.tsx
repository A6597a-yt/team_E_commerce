"use client"
import React, { useState, use } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';

// --- 타입 정의 (Next.js 16 비동기 params 대응) ---
interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
    // 1. 비동기 Params 언래핑
    const { id } = use(params);

    // 2. 상태 관리
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedImg, setSelectedImg] = useState(0);

    // --- 임시 데이터 (추후 백엔드 API 연동) ---
    const product = {
        id: id,
        category: "에어소프트건",
        subCategory: "GBB 라이플",
        name: "VFC M4A1 RIS II GBB (Colt Licensed)",
        price: 685000,
        rating: 4.9,
        reviewCount: 128,
        stock: 12,
        images: [
            'https://placehold.co/800x800/222/fff?text=VFC+M4A1+Main',
            'https://placehold.co/800x800/333/fff?text=Detail+View+1',
            'https://placehold.co/800x800/444/fff?text=Detail+View+2',
        ],
        tags: ["Liscensed", "Gas Blowback", "Real Weight"]
    };

    const handleQuantity = (type: 'plus' | 'minus') => {
        if (type === 'plus') setQuantity(prev => prev + 1);
        else if (type === 'minus' && quantity > 1) setQuantity(prev => prev - 1);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-24 lg:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">

                {/* --- 1. 브레드크럼 (Breadcrumb) --- */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mb-8">
                    <Link href="/" className="hover:text-blue-600 transition-colors">HOME</Link>
                    <Icon icon="solar:alt-arrow-right-linear" width={12} />
                    <Link href={`/category/${product.category}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
                    <Icon icon="solar:alt-arrow-right-linear" width={12} />
                    <span className="text-slate-900 dark:text-slate-200 font-bold">{product.subCategory}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* --- 2. 좌측: 이미지 갤러리 --- */}
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <img src={product.images[selectedImg]} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
                            <button className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-md text-slate-400 hover:text-red-500 transition-colors">
                                <Icon icon="solar:heart-bold" width={22} />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImg(i)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- 3. 우측: 상품 상세 정보 및 구매 섹션 --- */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                {product.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-full">
                                    <Icon icon="solar:star-bold" className="text-amber-400" width={18} />
                                    <span className="font-bold text-amber-600">{product.rating}</span>
                                </div>
                                <span className="text-sm text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-4">
                                    구매평 <strong>{product.reviewCount}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 py-6 border-y border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-bold text-slate-400 line-through">720,000원</span>
                            <div className="flex items-center gap-3">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">{product.price.toLocaleString()}원</span>
                                <span className="text-xl font-bold text-red-500">5% OFF</span>
                            </div>
                        </div>

                        {/* 구매 옵션 설정 */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">수량 선택</span>
                                <div className="flex items-center w-max bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
                                    <button onClick={() => handleQuantity('minus')} className="p-3 text-slate-500 hover:text-blue-600 transition-colors">
                                        <Icon icon="solar:minus-circle-bold-duotone" width={24} />
                                    </button>
                                    <span className="w-12 text-center font-black text-slate-900 dark:text-white">{quantity}</span>
                                    <button onClick={() => handleQuantity('plus')} className="p-3 text-slate-500 hover:text-blue-600 transition-colors">
                                        <Icon icon="solar:add-circle-bold-duotone" width={24} />
                                    </button>
                                </div>
                            </div>

                            {/* 총 금액 표시 */}
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-5 rounded-2xl flex justify-between items-center">
                                <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">총 주문 금액</span>
                                <span className="text-2xl font-black text-blue-600">{(product.price * quantity).toLocaleString()}원</span>
                            </div>

                            {/* 버튼 그룹 (데스크톱 전용) */}
                            <div className="hidden lg:flex gap-4">
                                <button className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black hover:bg-slate-200 transition-colors">
                                    장바구니
                                </button>
                                <button className="flex-[2] h-16 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                                    결제하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 4. 하단 정보 탭 섹션 --- */}
                <div className="mt-20">
                    <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-10">
                        {['description', 'reviews', 'shipping'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-5 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab === 'description' ? '상세설명' : tab === 'reviews' ? '리뷰' : '배송/교환'}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
                            </button>
                        ))}
                    </div>
                    <div className="py-12 min-h-[400px]">
                        {activeTab === 'description' && (
                            <div className="flex flex-col gap-8 items-center">
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center max-w-2xl">
                                    본 제품은 VFC의 정식 라이선스를 받은 제품으로, 실물과 동일한 각인과 무게감을 자랑합니다.
                                    안정적인 작동성을 위해 업그레이드된 노즐 시스템이 적용되었습니다.
                                </p>
                                <img src="https://placehold.co/1000x1500/222/fff?text=Detailed+Description+Image" className="rounded-3xl w-full max-w-4xl" alt="detail" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 5. 모바일 전용 하단 고정 구매 바 (Sticky) --- */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 flex gap-3 z-50">
                <button className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white">
                    <Icon icon="solar:cart-large-minimalistic-linear" width={24} />
                </button>
                <button className="flex-1 bg-blue-600 text-white rounded-xl font-black text-sm">
                    구매하기 ({(product.price * quantity).toLocaleString()}원)
                </button>
            </div>
        </div>
    );
}