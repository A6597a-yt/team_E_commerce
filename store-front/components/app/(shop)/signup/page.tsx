'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SignupPage() {
    const router = useRouter();

    // 상태 관리 (passwordConfirm 추가)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        phone: '',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 휴대폰 번호 자동 하이픈 변환 함수
    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/[^\d]/g, ''); // 숫자만 추출
        if (numbers.length < 4) return numbers;
        if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // 연락처 필드일 경우 하이픈 포맷 적용
        if (name === 'phone') {
            setFormData((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setErrorMsg(''); // 입력 시 에러 메시지 초기화
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. 프론트엔드 유효성 검사
        if (!formData.email || !formData.password || !formData.name || !formData.phone) {
            setErrorMsg('모든 필수 항목을 입력해주세요.');
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setErrorMsg('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        // 백엔드 DTO 규격에 맞춘 페이로드 (passwordConfirm 제외)
        const payload = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone, // "010-1234-5678" 형태로 전송됨
        };

        try {
            // 2. API 호출
            await api.post('/api/members/signup', payload);

            // 3. 성공 처리
            alert('회원가입이 완료되었습니다. 로그인해 주세요.');
            router.push('/login'); // 자동 로그인 없이 로그인 페이지로 이동

        } catch (error: any) {
            console.error('회원가입 에러:', error);
            // 백엔드에서 내려주는 에러 메시지(예: 중복된 이메일 등) 처리
            const message = error.response?.data?.message || '회원가입 처리 중 문제가 발생했습니다.';
            setErrorMsg(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        회원가입
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        {/* 이메일 */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* 이름 */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="홍길동"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* 연락처 */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                required
                                maxLength={13} // 010-1234-5678 기준
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="010-0000-0000"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="비밀번호를 입력해주세요"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                            <input
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type="password"
                                required
                                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="비밀번호를 다시 한 번 입력해주세요"
                                value={formData.passwordConfirm}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* 에러 메시지 출력 영역 */}
                    {errorMsg && (
                        <p className="text-sm text-red-600 text-center font-medium">{errorMsg}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative flex w-full justify-center rounded-md bg-black px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:bg-gray-400 transition"
                        >
                            {isLoading ? '처리 중...' : '가입하기'}
                        </button>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                        <div className="text-sm">
                            <span className="text-gray-500 mr-2">이미 계정이 있으신가요?</span>
                            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                로그인하기
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}