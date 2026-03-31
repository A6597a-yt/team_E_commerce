'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '', // 백엔드 DTO에 맞춰 email 또는 username으로 변경하세요
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrorMsg(''); // 입력 시 에러 메시지 초기화
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setErrorMsg('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // ✅ 수정된 부분: fetch -> api.post
            const response = await api.post('/login', formData);

            // axios는 기본적으로 2xx 응답만 resolve하므로 response.ok 체크 불필요
            const token = response.data.accessToken;

            if (token) {
                localStorage.setItem('accessToken', token);
                alert('로그인 성공!');
                router.push('/');
            } else {
                setErrorMsg('토큰을 발급받지 못했습니다.');
            }
        } catch (error) {
            // axios 에러 처리
            console.error('로그인 요청 에러:', error);
            setErrorMsg('아이디 또는 비밀번호가 일치하지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        로그인
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">이메일 주소</label>
                            <input
                                id="email"
                                name="email"
                                type="text" // 이메일 형식이면 email, 일반 아이디면 text
                                required
                                className="relative block w-full rounded-t-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="아이디 또는 이메일"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">비밀번호</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-600 text-center">{errorMsg}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-md bg-black px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:bg-gray-400 transition"
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                비밀번호를 잊으셨나요?
                            </a>
                        </div>
                        <div className="text-sm">
                            <a href="/signup" className="font-medium text-gray-600 hover:text-black">
                                회원가입
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}