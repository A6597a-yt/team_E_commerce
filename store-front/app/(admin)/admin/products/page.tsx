"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox'; // 경로에 맞게 수정해주세요

// 임시 타입 정의 (백엔드 연동 시 실제 DTO에 맞게 수정)
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'SALE' | 'SOLD_OUT' | 'HIDDEN';
}

const ProductManagementPage = () => {
    // --- 상태 관리 ---
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 필터 및 페이징 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('ALL');
    const [sortOption, setSortOption] = useState('latest');
    const [currentPage, setCurrentPage] = useState(0); // Spring Boot Pageable은 0부터 시작
    const [totalPages, setTotalPages] = useState(1);

    // --- API 호출 로직 (Spring Boot Page<T> 연동 뼈대) ---
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // 실제 API 호출 주석 처리
                // const queryParams = new URLSearchParams({
                //   page: currentPage.toString(),
                //   size: '20',
                //   sort: sortOption, // 예: 'price,desc'
                //   category: category !== 'ALL' ? category : '',
                //   keyword: searchQuery
                // });
                // const response = await fetch(`/api/admin/products?${queryParams}`);
                // const data = await response.json();
                // setProducts(data.content);
                // setTotalPages(data.totalPages);

                // API 연동 전 UI 확인용 더미 데이터
                setTimeout(() => {
                    setProducts([
                        { id: 1, name: '고성능 전동건 M4A1', category: '에어소프트건', price: 450000, stock: 15, status: 'SALE' },
                        { id: 2, name: '전술 방탄 조끼', category: '장구류', price: 85000, stock: 0, status: 'SOLD_OUT' },
                        { id: 3, name: '1/144 건담 프라모델', category: '프라모델', price: 32000, stock: 50, status: 'SALE' },
                    ]);
                    setTotalPages(5);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error("상품 목록을 불러오는 데 실패했습니다.", error);
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, category, sortOption]); // 필터 조건 변경 시 재호출 (검색어는 별도 버튼/엔터 처리 권장)

    // --- 이벤트 핸들러 ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(products.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (confirm(`선택한 ${selectedIds.length}개의 상품을 삭제하시겠습니까?`)) {
            console.log('삭제 요청 ID 목록:', selectedIds);
            // 삭제 API 호출 로직 추가
            setSelectedIds([]);
        }
    };

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setter(value);
        setCurrentPage(0); // 필터나 정렬이 바뀌면 1페이지로 초기화
    };

    return (
        <div className="flex flex-col gap-6">
            {/* 상단 헤더 영역 */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">상품 관리</h2>
                    <p className="text-sm text-slate-500 mt-1">등록된 상품을 조회하고 관리할 수 있습니다.</p>
                </div>
                <Link href="/admin/products/add" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                    <Icon icon="solar:add-circle-line-duotone" width={20} />
                    상품 등록
                </Link>
            </div>

            <CardBox>
                {/* 툴바 영역 (검색, 필터, 다중 선택 액션) */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* 좌측: 다중 선택 액션 버튼 (선택된 항목이 있을 때만 표시) */}
                    <div className="flex items-center gap-2 min-h-[40px]">
                        {selectedIds.length > 0 && (
                            <>
                                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-md">
                                    {selectedIds.length}개 선택됨
                                </span>
                                <button onClick={handleBulkDelete} className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-200 transition-colors">
                                    선택 삭제
                                </button>
                                <button className="text-sm bg-slate-50 text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 transition-colors">
                                    선택 품절처리
                                </button>
                            </>
                        )}
                    </div>

                    {/* 우측: 검색 및 드롭다운 필터 */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* 검색창 */}
                        <div className="relative flex-1 md:w-64">
                            <Icon icon="solar:magnifer-line-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width={18} />
                            <input
                                type="text"
                                placeholder="상품명 검색"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        {/* 카테고리 필터 */}
                        <select
                            value={category}
                            onChange={(e) => handleFilterChange(setCategory, e.target.value)}
                            className="py-2 pl-3 pr-8 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                            <option value="ALL">전체 카테고리</option>
                            <option value="에어소프트건">에어소프트건</option>
                            <option value="장구류">장구류</option>
                            <option value="프라모델">프라모델</option>
                        </select>

                        {/* 정렬 필터 (드롭다운) */}
                        <select
                            value={sortOption}
                            onChange={(e) => handleFilterChange(setSortOption, e.target.value)}
                            className="py-2 pl-3 pr-8 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                            <option value="latest">최신 등록순</option>
                            <option value="price,desc">가격 높은순</option>
                            <option value="price,asc">가격 낮은순</option>
                            <option value="stock,desc">재고 많은순</option>
                            <option value="stock,asc">재고 적은순</option>
                        </select>
                    </div>
                </div>

                {/* 테이블 영역 */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                <th className="p-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={products.length > 0 && selectedIds.length === products.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                </th>
                                <th className="p-4">상품명</th>
                                <th className="p-4 w-32">카테고리</th>
                                <th className="p-4 w-32 text-right">판매가</th>
                                <th className="p-4 w-24 text-right">재고</th>
                                <th className="p-4 w-28 text-center">상태</th>
                                <th className="p-4 w-24 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        데이터를 불러오는 중입니다...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        등록된 상품이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(product.id)}
                                                onChange={() => handleSelectItem(product.id)}
                                                className="rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-slate-800 dark:text-white truncate max-w-[200px]">
                                            {product.name}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {product.category}
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-right text-slate-800 dark:text-white">
                                            {product.price.toLocaleString()}원
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {product.status === 'SALE' ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    판매중
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                                    품절
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                                                <Icon icon="solar:pen-new-square-line-duotone" width={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 (간단한 UI 뼈대) */}
                {!isLoading && totalPages > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                        >
                            <Icon icon="solar:alt-arrow-left-line-duotone" width={20} />
                        </button>
                        <span className="text-sm font-medium text-slate-700">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                        >
                            <Icon icon="solar:alt-arrow-right-line-duotone" width={20} />
                        </button>
                    </div>
                )}
            </CardBox>
        </div>
    );
};

export default ProductManagementPage;