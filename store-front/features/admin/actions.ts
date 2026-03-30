'use server';

import { cookies } from 'next/headers';
import { fetchToSpringBoot, ActionResponse } from '@/lib/action-utils';

// 1. 관리자 로그인
export async function adminLoginAction(formData: FormData): Promise<ActionResponse> {
    const adminId = formData.get('adminId') as string;
    const password = formData.get('password') as string;

    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/admin/login` : '/api/v1/admin/login';

        const response = await fetchToSpringBoot<any>(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminId, password }),
        });

        const token = response.data || response.adminToken || response;

        if (!token || typeof token !== 'string') {
            return { success: false, error: '유효한 관리자 토큰을 받지 못했습니다.' };
        }

        const cookieStore = await cookies();
        cookieStore.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }
}

// 2. 관리자 로그아웃
export async function adminLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('adminToken');
}

// 3. 알림 발송 로그 조회 (추가됨)
export async function getNotificationLogsAction() {
    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/admin/notifications` : '/api/v1/admin/notifications';
        const cookieStore = await cookies();
        const token = cookieStore.get('adminToken')?.value || cookieStore.get('accessToken')?.value;

        const response = await fetchToSpringBoot<any>(endpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        return { success: true, data: response.data?.content || response.data || response };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
}