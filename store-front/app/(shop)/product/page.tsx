"use client"
import React, { use } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';

// --- 타입 정의 (Next.js 16 비동기 searchParams 대응) ---
interface ProductListPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// --- 임시 상품 데이터 ---
const allProducts = [
    { id: 1, name: 'VFC M4A1 RIS II GBB', price: 685000, rating: 4.9, category: 'airsoft', isOutOfStock: false, image: 'https://placehold.co/400x400/222/fff?text=M4A1' },
    { id: 2, name: 'Crye Precision JPC 2.0', price: 420000, rating: 5.0, category: 'gear', isOutOfStock: true, image: 'https://placehold.co/400x400/222/fff?text=JPC+2.0' },
    { id: 3, name: 'TIGER I (1/35 Scale)', price: 58000, rating: 4.8, category: 'model', isOutOfStock: false, image: 'https://placehold.co/400x400/222/fff?text=TIGER+I' },
    { id: 4, name: 'Glock 17 Gen5 GBB', price: 245000, rating: 4.7, category: 'airsoft', isOutOfStock: false, image: 'https://placehold.co/400x400/222/fff?text=Glock+17' },
    { id: 5, name: 'Tactical FAST Helmet', price: 125000, rating: 4.5, category: 'gear', isOutOfStock: true, image: 'https://placehold.co/400x400/222/fff?text=Helmet' },
    { id: 6, name: 'Magpul MS4 Sling', price: 95000, rating: 5.0, category: 'gear', isOutOfStock: false, image: 'https://placehold.co/400x400/222/fff?text=Sling' },
];

export default function ProductListPage({ searchParams }: ProductListPageProps) {
    // 1. 비동기 searchParams 언래핑
    const sParams = use(searchParams);
    const currentCategory = sParams.category || 'all';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* --- 1. 좌측 사이드바 필터 --- */}
                <aside className="w-full lg:w-64 flex flex-col gap-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="solar:filter-bold-duotone" className="text-blue-600" />
                            상세 필터
                        </h3>

                        {/* 카테고리 체크박스 그룹 */}
                        <div className="flex flex-col gap-6">
                            <div className="space-y-3">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">카테고리</p>
                                {['에어소프트건', '장구류', '프라모델', '부품/옵션'].map((cat) => (
                                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">{cat}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">가격대</p>
                                {['5만원 이하', '5만원 ~ 20만원', '20만원 ~ 50만원', '50만원 이상'].map((price) => (
                                    <label key={price} className="flex items-center gap-3 group cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors">{price}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- 2. 메인 상품 목록 영역 --- */}
                <div className="flex-1">
                    {/* 상단 정렬 및 요약 정보 */}
                    <div className="flex justify-between items-center mb-8 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-sm text-slate-500 font-medium">
                            총 <span className="text-blue-600 font-bold">{allProducts.length}</span>개의 상품이 있습니다.
                        </p>
                        <select className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer">
                            <option>신상품순</option>
                            <option>낮은 가격순</option>
                            <option>높은 가격순</option>
                            <option>리뷰 많은순</option>
                        </select>
                    </div>

                    {/* 상품 그리드 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                        {allProducts.map((product) => (
                            /* 💡 [연동 추가]: div 대신 Link 컴포넌트 사용 */
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="flex flex-col gap-3 group cursor-pointer"
                            >
                                {/* 상품 이미지 영역 */}
                                <div className={`relative aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all shadow-sm ${product.isOutOfStock ? 'bg-slate-200' : 'bg-slate-50 hover:shadow-md'}`}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-all duration-500 ${product.isOutOfStock ? 'opacity-40 grayscale blur-[1px]' : 'group-hover:scale-105'}`}
                                    />

                                    {/* 품절 레이블 */}
                                    {product.isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-black rounded-lg tracking-widest">
                                                SOLD OUT
                                            </div>
                                        </div>
                                    )}

                                    {/* 장바구니 퀵 버튼 (재고 있을 때만 노출) */}
                                    {!product.isOutOfStock && (
                                        <button className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-blue-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hidden md:block">
                                            <Icon icon="solar:cart-plus-bold" width={20} />
                                        </button>
                                    )}
                                </div>

                                {/* 상품 정보 영역 */}
                                <div className={`flex flex-col gap-1 px-1 ${product.isOutOfStock ? 'opacity-40' : ''}`}>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                            {product.price.toLocaleString()}원
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5 text-xs font-bold text-slate-500">
                                        <Icon icon="solar:star-bold" className="text-amber-400" width={14} />
                                        {product.rating}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* 페이지네이션 (추후 구현) */}
                    <div className="mt-20 flex justify-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 font-bold hover:bg-slate-50 transition-colors">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 font-bold hover:bg-slate-50 transition-colors">
                            <Icon icon="solar:alt-arrow-right-linear" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}