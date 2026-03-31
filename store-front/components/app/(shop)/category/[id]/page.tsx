'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { products, categories } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function CategoryPage() {
    const params = useParams();
    const categoryId = params.id as string;

    // 1. 현재 카테고리 정보 찾기
    const currentCategory = categories.find(cat => cat.id === categoryId);

    // 2. 해당 카테고리 상품 필터링
    const filteredProducts = products.filter(product => product.categoryId === categoryId);

    if (!currentCategory) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-xl font-bold">존재하지 않는 카테고리입니다.</h2>
                <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">메인으로 돌아가기</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* 상단 카테고리 헤더 */}
            <header className="flex flex-col items-center gap-4 mb-12">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm ${currentCategory.color}`}>
                    <Icon icon={currentCategory.icon} width={40} />
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-black text-slate-900">{currentCategory.name}</h1>
                    <p className="text-slate-500 mt-2">{filteredProducts.length}개의 상품이 준비되어 있습니다.</p>
                </div>
            </header>

            {/* 상품 그리드 */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                    <Icon icon="solar:box-minimalistic-linear" width={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">이 카테고리에는 아직 등록된 상품이 없습니다.</p>
                </div>
            )}
        </div>
    );
}