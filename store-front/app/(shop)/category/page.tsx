'use client';

import React from 'react';
import { categories } from '@/data/products';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function CategoryIndexPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-3xl font-black text-slate-900">카테고리 전체보기</h1>
                <p className="text-slate-500 mt-2">원하시는 장비의 분류를 선택하세요.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="group flex flex-col items-center gap-6 p-10 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-2"
                    >
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm ${cat.color} transition-transform group-hover:scale-110`}>
                            <Icon icon={cat.icon} width={40} />
                        </div>
                        <span className="text-lg font-bold text-slate-800">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}