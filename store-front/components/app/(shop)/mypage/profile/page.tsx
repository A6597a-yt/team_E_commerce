'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import api from '@/lib/api';

export default function ProfileEditPage() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
    });

    useEffect(() => {
        api.get('/api/members/me').then(res => setFormData(res.data));
    }, []);

    const handleUpdate = async () => {
        try {
            // 실제로는 patch나 post를 호출
            alert('회원 정보가 성공적으로 수정되었습니다.');
        } catch (error) {
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div className="px-2">
                <h2 className="text-2xl font-black text-slate-900">내 정보 수정</h2>
                <p className="text-sm text-slate-500 mt-1">회원님의 소중한 정보를 안전하게 관리하세요.</p>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-slate-400 mb-2 ml-1 uppercase">이메일 (아이디)</label>
                        <input
                            type="text" value={formData.email} readOnly
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 mb-2 ml-1 uppercase">이름</label>
                        <input
                            type="text" value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 mb-2 ml-1 uppercase">연락처</label>
                        <input
                            type="text" value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={handleUpdate}
                    className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                    정보 수정 완료
                </button>
            </div>
        </div>
    );
}