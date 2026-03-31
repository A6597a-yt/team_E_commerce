"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// 카테고리 타입 정의 (동일)
interface Category {
    id: number;
    name: string;
    parentId: number | null; // null이면 1차(최상위) 카테고리
    status: 'ACTIVE' | 'HIDDEN';
}

const CategoryManagementPage = () => {
    // --- 상태 관리 (동일) ---
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 폼 상태 관리 (동일)
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<{ id?: number; name: string; parentId: number | null | string; status: 'ACTIVE' | 'HIDDEN' }>({
        name: '',
        parentId: 'null', // select box 처리를 위해 초기값을 문자열 'null'로 세팅
        status: 'ACTIVE'
    });

    // --- API 호출 로직 (목록 조회 뼈대 - 동일) ---
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                // 실제 API 연동 시 아래 주석 해제
                // const res = await fetch('/api/admin/categories');
                // const data = await res.json();
                // setCategories(data);

                // UI 확인용 더미 데이터 세팅 (1차 및 2차 카테고리 혼합 - 동일)
                setTimeout(() => {
                    setCategories([
                        { id: 1, name: '에어소프트건', parentId: null, status: 'ACTIVE' },
                        { id: 2, name: '전동건 (AEG)', parentId: 1, status: 'ACTIVE' },
                        { id: 3, name: '가스건 (GBB)', parentId: 1, status: 'ACTIVE' },
                        { id: 4, name: '장구류', parentId: null, status: 'ACTIVE' },
                        { id: 5, name: '전술 조끼', parentId: 4, status: 'HIDDEN' },
                        { id: 6, name: '프라모델', parentId: null, status: 'ACTIVE' },
                    ]);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error("카테고리 목록을 불러오는 데 실패했습니다.", error);
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // --- 이벤트 핸들러 (동일) ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (category: Category) => {
        setIsEditing(true);
        setFormData({
            id: category.id,
            name: category.name,
            parentId: category.parentId === null ? 'null' : category.parentId.toString(),
            status: category.status
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({ name: '', parentId: 'null', status: 'ACTIVE' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("카테고리명을 입력해주세요.");
            return;
        }

        const payload = {
            ...formData,
            parentId: formData.parentId === 'null' ? null : Number(formData.parentId)
        };

        console.log("전송 데이터 세팅 완료 (API 연동 시 주석 해제):", payload);

        // try {
        //   const method = isEditing ? 'PUT' : 'POST';
        //   const url = isEditing ? `/api/admin/categories/${payload.id}` : '/api/admin/categories';
        //   const res = await fetch(url, {
        //     method,
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        //   });
        //   if (res.ok) {
        //     alert(`카테고리가 성공적으로 ${isEditing ? '수정' : '등록'}되었습니다.`);
        //     handleCancelEdit(); // 폼 초기화
        //     // fetchCategories(); // 목록 새로고침
        //   }
        // } catch (error) {
        //   console.error("저장 실패:", error);
        // }
    };

    // --- 렌더링 헬퍼 (동일) ---
    // 1차 카테고리만 필터링 (select box용)
    const rootCategories = categories.filter(c => c.parentId === null);

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-6 md:p-8">
            {/* 1. 개선된 페이지 헤더 영역 (타이포그래피 및 여백 개선) */}
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">카테고리 관리</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 mt-2">쇼핑몰의 메뉴 구조(1단, 2단)와 노출 상태를 편리하게 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. 좌측: 개선된 카테고리 등록/수정 폼 (여백, 입력 디자인 개선) */}
                <div className="lg:col-span-1">
                    <CardBox className="p-8 pb-10">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                            {isEditing ? '카테고리 수정' : '새 카테고리 등록'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* 각 입력 필드 간 여백 개선 (mb-6) */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">상위 카테고리</label>
                                <select
                                    name="parentId"
                                    value={formData.parentId as string}
                                    onChange={handleInputChange}
                                    // 현대적인 입력 필드 디자인 (padding, shadow-inner, bg-white/slate-900)
                                    className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary dark:bg-slate-800 dark:text-white shadow-inner bg-white dark:bg-slate-900"
                                >
                                    <option value="null">최상위 카테고리 (없음)</option>
                                    {rootCategories.map(root => (
                                        root.id !== formData.id && (
                                            <option key={root.id} value={root.id}>
                                                {root.name}
                                            </option>
                                        )
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-2">* 최상위를 선택하면 1차 카테고리가 됩니다.</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">카테고리명 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="예: 에어소프트건"
                                    className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:text-white shadow-inner bg-white dark:bg-slate-900"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">상태</label>
                                <div className="flex gap-5 items-center">
                                    <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="ACTIVE"
                                            checked={formData.status === 'ACTIVE'}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-slate-300"
                                        />
                                        사용중
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="HIDDEN"
                                            checked={formData.status === 'HIDDEN'}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-slate-300"
                                        />
                                        숨김
                                    </label>
                                </div>
                            </div>

                            {/* 3. 개선된 하단 우측 버튼 배치 (gap, padding, mt 개선, border 제거) */}
                            <div className="flex justify-end gap-3.5 mt-10">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-5 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        취소
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    // 현대적인 버튼 디자인 (padding, shadow-sm, font-medium) 및 Submit 버튼 타입 블랙
                                    className="px-5 py-2.5 text-sm rounded-lg bg-black text-white hover:bg-slate-800 transition-colors shadow-sm shadow-slate-900/10 font-medium"
                                >
                                    {isEditing ? '수정 완료' : '카테고리 등록'}</button>
                            </div>
                        </form>
                    </CardBox>
                </div>

                {/* 우측: 카테고리 목록 구조도 (동일, 단 CardBox 내부 여백 통일 고려) */}
                <div className="lg:col-span-2">
                    <CardBox className="h-full p-6 md:p-8">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
                            등록된 카테고리 목록
                        </h3>

                        {isLoading ? (
                            <div className="py-8 text-center text-slate-500 text-sm">데이터를 불러오는 중입니다...</div>
                        ) : categories.length === 0 ? (
                            <div className="py-8 text-center text-slate-500 text-sm">등록된 카테고리가 없습니다.</div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {rootCategories.map(root => (
                                    <div key={root.id} className="flex flex-col gap-1">
                                        {/* 1차 카테고리 */}
                                        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-slate-800 dark:text-white text-base">{root.name}</span>
                                                {root.status === 'ACTIVE' ? (
                                                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700">사용중</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-200 text-slate-600">숨김</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleEditClick(root)}
                                                className="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"
                                                title="수정"
                                            >
                                                <Icon icon="solar:pen-new-square-line-duotone" width={20} />
                                            </button>
                                        </div>

                                        {/* 2차 카테고리 렌더링 (동일, 단 들여쓰기 여백 조정 고려) */}
                                        {categories.filter(c => c.parentId === root.id).map(child => (
                                            <div key={child.id} className="flex items-center justify-between p-2 pl-4 ml-8 border-l-2 border-slate-200 dark:border-slate-700 mt-1 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-r-lg transition-colors">
                                                <div className="flex items-center gap-2.5">
                                                    <Icon icon="solar:corner-down-right-line-duotone" className="text-slate-400" width={18} />
                                                    <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{child.name}</span>
                                                    {child.status === 'ACTIVE' ? (
                                                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700">사용중</span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-200 text-slate-600">숨김</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleEditClick(child)}
                                                    className="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/10"
                                                    title="수정"
                                                >
                                                    <Icon icon="solar:pen-new-square-line-duotone" width={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBox>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagementPage;