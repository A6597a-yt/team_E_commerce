"use client"
import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';

// --- 임시 데이터 (실제 연동 시 API에서 호출) ---
const categories = [
    { id: 'airsoft', name: '에어소프트건', icon: 'solar:target-bold-duotone', color: 'bg-orange-100 text-orange-600' },
    { id: 'gear', name: '장구류', icon: 'solar:backpack-bold-duotone', color: 'bg-blue-100 text-blue-600' },
    { id: 'model', name: '프라모델', icon: 'solar:box-bold-duotone', color: 'bg-emerald-100 text-emerald-600' },
    { id: 'parts', name: '부품/옵션', icon: 'solar:settings-bold-duotone', color: 'bg-slate-100 text-slate-600' },
];

const products = [
    { id: 1, name: 'VFC M4A1 RIS II GBB (Colt Licensed)', price: 685000, rating: 4.9, image: 'https://placehold.co/400x400/222/fff?text=VFC+M4A1', isNew: true },
    { id: 2, name: 'Crye Precision JPC 2.0 - Multicam', price: 420000, rating: 5.0, image: 'https://placehold.co/400x400/222/fff?text=JPC+2.0', isBest: true },
    { id: 3, name: 'TIGER I Early Production (1/35 Scale)', price: 58000, rating: 4.8, image: 'https://placehold.co/400x400/222/fff?text=TIGER+I' },
    { id: 4, name: 'Glock 17 Gen5 GBB (Umarex)', price: 245000, rating: 4.7, image: 'https://placehold.co/400x400/222/fff?text=Glock+17' },
    { id: 5, name: 'Tactical FAST Helmet - Black', price: 125000, rating: 4.5, image: 'https://placehold.co/400x400/222/fff?text=Helmet' },
    { id: 6, name: 'Magpul MS4 Dual QD Sling', price: 95000, rating: 5.0, image: 'https://placehold.co/400x400/222/fff?text=Sling', isNew: true },
    { id: 7, name: 'EOTech EXPS3-0 Replica', price: 110000, rating: 4.2, image: 'https://placehold.co/400x400/222/fff?text=EOTech' },
    { id: 8, name: 'ESS Profile NVG Goggles', price: 85000, rating: 4.6, image: 'https://placehold.co/400x400/222/fff?text=Goggles' },
];

// --- 재사용 가능한 상품 카드 컴포넌트 ---
const ProductCard = ({ product }: { product: any }) => (
    <Link href={`/product/${product.id}`} className="group flex flex-col gap-3">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm transition-all group-hover:shadow-md">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* 상태 뱃지 */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isNew && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">NEW</span>}
                {product.isBest && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">BEST</span>}
            </div>
            {/* 장바구니 간편 버튼 (데스크톱 호버용) */}
            <button className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 hidden md:block">
                <Icon icon="solar:cart-large-minimalistic-bold" width={20} />
            </button>
        </div>
        <div className="flex flex-col gap-1 px-1">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-extrabold text-slate-900">
                    {product.price.toLocaleString()}원
                </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
                <Icon icon="solar:star-bold" className="text-amber-400" width={14} />
                <span className="text-xs font-bold text-slate-600">{product.rating}</span>
            </div>
        </div>
    </Link>
);

export default function ShopMainPage() {
    return (
        <div className="flex flex-col gap-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

            {/* 1. 카테고리 퀵 내비게이션 */}
            <section className="flex justify-between md:justify-center items-center gap-4 md:gap-12 overflow-x-auto pb-4 no-scrollbar">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.id}`} className="flex flex-col items-center gap-3 flex-shrink-0 group">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-sm transition-transform group-hover:-translate-y-1 ${cat.color}`}>
                            <Icon icon={cat.icon} width={32} />
                        </div>
                        <span className="text-xs md:text-sm font-bold text-slate-700">{cat.name}</span>
                    </Link>
                ))}
            </section>

            {/* 2. New Arrivals (신상품 섹션) */}
            <section className="flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">신상품</h2>
                        <p className="text-sm text-slate-500 mt-1">최근 입고된 가장 뜨거운 기어들을 확인하세요.</p>
                    </div>
                    <Link href="/product" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                        전체보기 <Icon icon="solar:alt-arrow-right-line-duotone" width={16} />
                    </Link>
                </div>

                {/* 모바일 2열 그리드 / 데스크톱 4열 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* 3. 중간 신뢰도 카드 (Trust Section) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-y border-slate-100">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                    <Icon icon="solar:shield-check-bold-duotone" className="text-blue-600" width={32} />
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">100% 정품 보장</h4>
                        <p className="text-xs text-slate-500">본사 직수입 및 공식 라이선스 제품</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                    <Icon icon="solar:delivery-bold-duotone" className="text-blue-600" width={32} />
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">당일 발송 시스템</h4>
                        <p className="text-xs text-slate-500">오후 2시 전 결제 시 우체국 당일 발송</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                    <Icon icon="solar:chat-round-dots-bold-duotone" className="text-blue-600" width={32} />
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">전문가 기술 상담</h4>
                        <p className="text-xs text-slate-500">에어소프트 전문 인력의 1:1 상담</p>
                    </div>
                </div>
            </section>

            {/* 4. Best Sellers (인기 상품 섹션) */}
            <section className="flex flex-col gap-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Most Wanted</h2>
                    <p className="text-sm text-slate-500 mt-1">지금 가장 많은 대원들이 선택하고 있는 기어입니다.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {products.slice().reverse().map((product) => (
                        <ProductCard key={`best-${product.id}`} product={product} />
                    ))}
                </div>
            </section>

        </div>
    );
}