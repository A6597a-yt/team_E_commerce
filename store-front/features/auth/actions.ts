'use server';

import { cookies } from 'next/headers';
import { fetchToSpringBoot, ActionResponse } from '@/lib/action-utils';

// 로그인
export async function loginAction(formData: FormData): Promise<ActionResponse> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/members/login` : '/api/v1/members/login';

        // 백엔드로 로그인 요청 (응답의 data 필드에 JWT 토큰이 문자열로 온다고 가정)
        const response = await fetchToSpringBoot<{ status: number; data: string; message: string }>(endpoint, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 200 && response.data) {
            const cookieStore = await cookies();
            cookieStore.set('accessToken', response.data, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            return { success: true };
        } else {
            return { success: false, error: response.message || '로그인에 실패했습니다.' };
        }
    } catch (error: any) {
        return { success: false, error: error.message || '이메일 또는 비밀번호가 일치하지 않습니다.' };
    }
}

// 회원가입
export async function signupAction(formData: FormData): Promise<ActionResponse> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/members/signup` : '/api/v1/members/signup';

        const response = await fetchToSpringBoot<{ status: number; message: string }>(endpoint, {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });

        if (response.status === 200 || response.status === 201) {
            return { success: true };
        } else {
            return { success: false, error: response.message || '회원가입에 실패했습니다.' };
        }
    } catch (error: any) {
        return { success: false, error: error.message || '회원가입 처리 중 오류가 발생했습니다.' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken'); // 로그인 시 설정한 토큰 삭제
}