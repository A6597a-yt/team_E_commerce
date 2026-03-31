'use server';

import { cookies } from 'next/headers';
import { fetchToSpringBoot, ActionResponse } from '@/lib/action-utils';

export async function adminLoginAction(formData: FormData): Promise<ActionResponse> {
    const adminId = formData.get('adminId') as string;
    const password = formData.get('password') as string;

    try {
        // 미정인 API 엔드포인트에 대비하여 환경 변수 사용 (기본값 설정)
        const endpoint = process.env.ADMIN_LOGIN_API || '/api/admin/login';

        // 백엔드로 로그인 요청 (방식 A: JSON으로 토큰 응답을 기대함)
        const response = await fetchToSpringBoot<{ adminToken: string }>(endpoint, {
            method: 'POST',
            body: JSON.stringify({ adminId, password }),
        });

        // 성공 시, 응답받은 토큰을 HttpOnly 세션 쿠키로 굽기
        const cookieStore = await cookies();
        cookieStore.set('adminToken', response.adminToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            // 💡 핵심: expires나 maxAge 속성을 적지 않으면 브라우저 종료 시 삭제되는 '세션 쿠키'가 됩니다.
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }
}

export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('adminToken'); // 브라우저에서 관리자 쿠키 삭제
}