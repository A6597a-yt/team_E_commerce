"use client"
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import CardBox from '@/components/admin/shared/CardBox';

// --- 타입 정의 ---
interface ProfileData {
    adminId: string;
    name: string;
    nickname: string;
    role: string;
    email: string;
    contact: string;
    introduction: string;
    avatarUrl: string | null;
}

interface LoginHistory {
    id: string;
    loginAt: string;
    ipAddress: string;
    device: string;
    status: 'SUCCESS' | 'FAILED';
}

const AccountSettingsPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    // 프로필 상태
    const [profile, setProfile] = useState<ProfileData>({
        adminId: '', name: '', nickname: '', role: '', email: '', contact: '', introduction: '', avatarUrl: null
    });

    // 최근 접속 기록 상태
    const [history, setHistory] = useState<LoginHistory[]>([]);

    // --- API 호출 로직 (더미 데이터 세팅) ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setProfile({
                adminId: 'admin_master',
                name: '홍길동',
                nickname: '타이거', // 사이드바 노출용 별명
                role: '총괄 매니저',
                email: 'master@example.com',
                contact: '010 1234 5678', // 포맷 제한 없는 자유 입력
                introduction: '안녕하세요. 장난감 쇼핑몰 총괄 관리를 맡고 있는 홍길동입니다. \n빠르고 정확한 CS 처리와 안정적인 물류 시스템 운영을 목표로 하고 있습니다.',
                avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' // 임시 프로필 이미지
            });
            setHistory([
                { id: 'log_1', loginAt: '2026-03-30 08:45:12', ipAddress: '192.168.1.15', device: 'Windows 11 / Chrome', status: 'SUCCESS' },
                { id: 'log_2', loginAt: '2026-03-29 19:20:05', ipAddress: '112.150.xxx.xx', device: 'iPhone 15 Pro / Safari', status: 'SUCCESS' },
                { id: 'log_3', loginAt: '2026-03-29 19:18:22', ipAddress: '112.150.xxx.xx', device: 'iPhone 15 Pro / Safari', status: 'FAILED' },
                { id: 'log_4', loginAt: '2026-03-28 09:00:11', ipAddress: '192.168.1.15', device: 'Windows 11 / Edge', status: 'SUCCESS' },
                { id: 'log_5', loginAt: '2026-03-27 18:30:45', ipAddress: '192.168.1.15', device: 'Windows 11 / Chrome', status: 'SUCCESS' },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    // --- 이벤트 핸들러 ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarReset = () => {
        if (confirm('프로필 이미지를 기본 실루엣으로 초기화하시겠습니까?')) {
            setProfile(prev => ({ ...prev, avatarUrl: null }));
        }
    };

    const handleSaveProfile = () => {
        // API 연동: fetch('/api/admin/settings/account', { method: 'PUT', body: JSON.stringify(profile) })
        console.log('저장될 프로필:', profile);
        alert('내 계정 정보가 성공적으로 저장되었습니다.');
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">계정 정보를 불러오는 중입니다...</div>;

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto p-4 md:p-8 relative">

            {/* 1. 상단 헤더 및 일괄 저장 버튼 (Sticky 고정, 좌우 여백 적용) */}
            <div className="sticky top-0 z-10 bg-slate-50/90 dark:bg-[#0B0A26]/90 backdrop-blur-md py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">내 계정 관리</h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-1">관리자 프로필, 기본 정보 및 최근 로그인 보안 기록을 확인합니다.</p>
                </div>
                <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-600/30"
                >
                    <Icon icon="solar:diskette-bold-duotone" width={22} />
                    내 정보 저장
                </button>
            </div>

            <div className="flex flex-col gap-6">

                {/* 구역 1: 내 프로필 및 기본 정보 설정 */}
                <CardBox className="p-6 md:p-8 border-t-4 border-blue-600 shadow-sm bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Icon icon="solar:user-id-bold-duotone" className="text-blue-600" width={24} />
                        프로필 및 기본 정보
                    </h3>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                        {/* 1-1. 프로필 이미지 아바타 영역 */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden group">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="프로필 이미지" className="w-full h-full object-cover" />
                                ) : (
                                    <Icon icon="solar:user-bold-duotone" className="text-slate-400 w-20 h-20" />
                                )}

                                {/* 호버 시 나타나는 오버레이 (사진 변경 유도) */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Icon icon="solar:camera-add-bold-duotone" className="text-white w-10 h-10" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <button className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                    사진 업로드
                                </button>
                                <button onClick={handleAvatarReset} className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                    기본 이미지로 변경
                                </button>
                            </div>
                        </div>

                        {/* 1-2. 기본 정보 텍스트 폼 영역 */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">관리자 아이디</label>
                                <input type="text" value={profile.adminId} disabled className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">이름 (실명)</label>
                                <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    별명 / 콜사인 <span className="text-xs font-normal text-slate-500 ml-1">(사이드바 노출용)</span>
                                </label>
                                <input type="text" name="nickname" value={profile.nickname} onChange={handleChange} placeholder="예: 타이거, 독수리" className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">소속 / 직책</label>
                                <input type="text" name="role" value={profile.role} onChange={handleChange} placeholder="예: CS팀 팀장" className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">이메일 주소</label>
                                <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">연락처</label>
                                <input type="text" name="contact" value={profile.contact} onChange={handleChange} placeholder="자유롭게 입력하세요" className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm" />
                            </div>

                            <div className="md:col-span-2 mt-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">자기 소개 및 좌우명</label>
                                <textarea
                                    name="introduction"
                                    value={profile.introduction}
                                    onChange={handleChange}
                                    placeholder="본인을 나타내는 간단한 소개글이나 업무 좌우명을 적어주세요."
                                    className="w-full h-24 px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 bg-white dark:bg-slate-900 shadow-sm resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                </CardBox>

                {/* 구역 2: 최근 접속 기록 (보안 관제) */}
                <CardBox className="p-0 overflow-hidden border-t-4 border-slate-600 shadow-sm">
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Icon icon="solar:shield-keyhole-bold-duotone" className="text-slate-600 dark:text-slate-400" width={24} />
                            최근 로그인 기록 <span className="text-sm font-normal text-slate-500 ml-2">(최근 5건)</span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-2">본인이 아닌 접속 기록이 있다면, 즉시 최고 관리자에게 비밀번호 변경을 요청하세요.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    <th className="p-4 pl-6 w-48">접속 일시</th>
                                    <th className="p-4 w-40">IP 주소</th>
                                    <th className="p-4 w-auto">기기 및 브라우저 정보</th>
                                    <th className="p-4 w-32 text-center pr-6">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-slate-500">접속 기록이 없습니다.</td></tr>
                                ) : (
                                    history.map((log) => (
                                        <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="p-4 pl-6 text-sm font-medium text-slate-700 dark:text-slate-300">{log.loginAt}</td>
                                            <td className="p-4 text-sm font-mono text-slate-500">{log.ipAddress}</td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{log.device}</td>
                                            <td className="p-4 text-center pr-6">
                                                {log.status === 'SUCCESS' ? (
                                                    <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">성공</span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">실패</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBox>

            </div>
        </div>
    );
};

export default AccountSettingsPage;