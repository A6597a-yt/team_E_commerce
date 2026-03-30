"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// --- 타입 정의 ---
interface SiteSettings {
    // 1. 기본 정보
    shopName: string;
    ceoName: string;
    businessNumber: string;
    csPhone: string;
    csEmail: string;
    // 2. 운영/혜택
    rewardRate: number; // 기본 구매 적립률 (%)
    textReviewReward: number; // 텍스트 리뷰 적립금
    photoReviewReward: number; // 포토 리뷰 적립금
    // 3. 배송 정책
    shippingFee: number;
    freeShippingThreshold: number;
    defaultCourier: string;
    // 4. 시스템 제어
    isMaintenanceMode: boolean;
    maintenanceMessage: string;
}

const SiteSettingsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<SiteSettings>({
        shopName: '', ceoName: '', businessNumber: '', csPhone: '', csEmail: '',
        rewardRate: 0, textReviewReward: 0, photoReviewReward: 0,
        shippingFee: 0, freeShippingThreshold: 0, defaultCourier: '우체국택배',
        isMaintenanceMode: false, maintenanceMessage: ''
    });

    // --- API 호출 로직 (더미 데이터 세팅) ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setFormData({
                shopName: '장난감 쇼핑몰 (밀리터리/에어소프트)',
                ceoName: '홍길동',
                businessNumber: '123-45-67890',
                csPhone: '1588-0000',
                csEmail: 'cs@example.com',
                rewardRate: 0.5,
                textReviewReward: 500,
                photoReviewReward: 1000,
                shippingFee: 3000,
                freeShippingThreshold: 50000,
                defaultCourier: '우체국택배',
                isMaintenanceMode: false,
                maintenanceMessage: '더 나은 서비스를 위해 서버 점검 중입니다.\n점검 시간: 2026.04.01 02:00 ~ 06:00 [예시]'
            });
            setIsLoading(false);
        }, 500);
    }, []);

    // --- 이벤트 핸들러 ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveAll = () => {
        // API 연동: fetch('/api/admin/settings/site', { method: 'PUT', body: JSON.stringify(formData) })
        console.log('저장될 데이터:', formData);
        alert('사이트 전체 설정이 성공적으로 저장되었습니다.');
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">설정 정보를 불러오는 중입니다...</div>;

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto p-4 md:p-8 relative">

            {/* 1. 상단 헤더 및 일괄 저장 버튼 (Sticky 고정) */}
            <div className="sticky top-0 z-10 bg-slate-50/90 dark:bg-[#0B0A26]/90 backdrop-blur-md py-4 px-2 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">사이트 설정</h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-1">쇼핑몰의 기본 정보, 적립금, 배송 정책 및 시스템 상태를 관리합니다.</p>
                </div>
                <button
                    onClick={handleSaveAll}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-600/30"
                >
                    <Icon icon="solar:diskette-bold-duotone" width={22} />
                    전체 설정 저장
                </button>
            </div>

            <div className="flex flex-col gap-6">

                {/* 구역 1: 기본 정보 설정 */}
                <CardBox className="p-6 md:p-8 border-t-4 border-blue-600 shadow-sm bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Icon icon="solar:shop-2-bold-duotone" className="text-blue-600" width={24} />
                        기본 정보 설정
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">쇼핑몰명 (상호)</label>
                            <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">대표자명</label>
                            <input type="text" name="ceoName" value={formData.ceoName} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">사업자등록번호</label>
                            <input type="text" name="businessNumber" value={formData.businessNumber} onChange={handleChange} placeholder="000-00-00000" className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">고객센터 연락처</label>
                                <input type="text" name="csPhone" value={formData.csPhone} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">대표 이메일</label>
                                <input type="email" name="csEmail" value={formData.csEmail} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                            </div>
                        </div>
                    </div>
                </CardBox>

                {/* 구역 2: 운영 및 혜택 설정 */}
                <CardBox className="p-6 md:p-8 border-t-4 border-indigo-500 shadow-sm bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Icon icon="solar:wad-of-money-bold-duotone" className="text-indigo-500" width={24} />
                        운영 및 혜택 설정 (적립금)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">기본 구매 적립률 (%)</label>
                            <div className="relative">
                                <input type="number" name="rewardRate" value={formData.rewardRate} onChange={handleChange} className="w-full px-4 py-2.5 pr-8 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 bg-white dark:bg-slate-900 shadow-sm" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">텍스트 리뷰 작성 시 (원)</label>
                            <input type="number" name="textReviewReward" value={formData.textReviewReward} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">포토 리뷰 작성 시 (원)</label>
                            <input type="number" name="photoReviewReward" value={formData.photoReviewReward} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-500 bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                    </div>
                </CardBox>

                {/* 구역 3: 배송 정책 설정 */}
                <CardBox className="p-6 md:p-8 border-t-4 border-emerald-500 shadow-sm bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Icon icon="solar:box-minimalistic-bold-duotone" className="text-emerald-500" width={24} />
                        배송 정책 설정
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">기본 배송비 (원)</label>
                            <input type="number" name="shippingFee" value={formData.shippingFee} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-500 bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">무료 배송 조건 (원 이상)</label>
                            <input type="number" name="freeShippingThreshold" value={formData.freeShippingThreshold} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-500 bg-white dark:bg-slate-900 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">기본 지정 택배사</label>
                            <select name="defaultCourier" value={formData.defaultCourier} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-500 bg-white dark:bg-slate-900 shadow-sm cursor-pointer">
                                <option value="우체국택배">우체국택배</option>
                                <option value="CJ대한통운">CJ대한통운</option>
                                <option value="로젠택배">로젠택배</option>
                                <option value="한진택배">한진택배</option>
                            </select>
                        </div>
                    </div>
                </CardBox>

                {/* 구역 4: 시스템 제어 (점검 모드) */}
                <CardBox className="p-6 md:p-8 border-t-4 border-red-500 shadow-sm bg-red-50/20 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg overflow-hidden">
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                        <Icon icon="solar:settings-bold-duotone" width={24} />
                        시스템 상태 제어
                    </h3>

                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Icon icon="solar:shield-warning-bold-duotone" className="text-red-500" width={18} />
                                    쇼핑몰 점검 모드 활성화
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">On으로 변경 시, 관리자 외 일반 고객의 사이트 접속이 전면 차단됩니다.</p>
                            </div>
                            {/* Tailwind 기반 프리미엄 토글 스위치 */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="isMaintenanceMode" checked={formData.isMaintenanceMode} onChange={handleChange} className="sr-only peer" />
                                <div className="w-16 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600 shadow-inner"></div>
                            </label>
                        </div>

                        {/* 점검 모드가 켜져 있을 때만 메시지 입력창 활성화 (시각적 피드백) */}
                        <div className={`transition-all duration-300 ${formData.isMaintenanceMode ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                <Icon icon="solar:dialog-bold-duotone" width={18} className="inline-block mr-1 text-slate-400" />
                                점검 안내 메시지 (고객 노출용)
                            </label>
                            <textarea
                                name="maintenanceMessage"
                                value={formData.maintenanceMessage}
                                onChange={handleChange}
                                placeholder="고객에게 노출될 점검 안내 문구를 작성해주세요."
                                className="w-full h-32 px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-500 bg-white dark:bg-slate-900 shadow-sm resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                </CardBox>

            </div>
        </div>
    );
};

export default SiteSettingsPage;