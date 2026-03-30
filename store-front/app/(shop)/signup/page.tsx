'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { signupAction } from '@/features/auth/actions';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        const formData = new FormData(e.currentTarget);
        const res = await signupAction(formData);

        if (res.success) {
            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            router.push('/login');
        } else {
            setErrorMsg(res.error || '회원가입에 실패했습니다.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-center">
                    <Icon icon="solar:user-plus-bold" className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-6 text-3xl font-black text-slate-900 dark:text-white">
                        회원가입
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        기본 정보를 입력해주세요.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">이메일</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">비밀번호 (8자 이상)</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">이름</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                placeholder="이름을 입력하세요"
                            />
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="text-red-500 text-sm font-bold text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? '처리 중...' : '가입하기'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">이미 계정이 있으신가요? </span>
                    <Link href="/login" className="text-sm font-bold text-blue-600 hover:text-blue-500">
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}