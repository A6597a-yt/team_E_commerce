'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export const ProductCard = ({ product }: { product: any }) => (
    <Link href={`/product/${product.id}`} className="group flex flex-col gap-3">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm transition-all group-hover:shadow-md">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isNew && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">NEW</span>}
                {product.isBest && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">BEST</span>}
            </div>
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