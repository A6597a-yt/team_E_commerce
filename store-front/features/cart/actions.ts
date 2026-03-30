'use server';

import { cookies } from 'next/headers';
import { fetchToSpringBoot, ActionResponse } from '@/lib/action-utils';

interface AddToCartPayload {
    productId: number;
    optionId?: number | null;
    quantity: number;
}

// 1. 장바구니 담기
export async function addToCartAction(payload: AddToCartPayload): Promise<ActionResponse> {
    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/carts` : '/api/v1/carts';

        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        if (!token) {
            return { success: false, error: '로그인이 필요한 서비스입니다.' };
        }

        await fetchToSpringBoot(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || '장바구니 담기에 실패했습니다.' };
    }
}

// 2. 장바구니 목록 조회
export async function getCartListAction() {
    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/carts` : '/api/v1/carts';
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        if (!token) return { success: false, error: '로그인이 필요합니다.', data: [] };

        const response = await fetchToSpringBoot<any>(endpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        return { success: true, data: response.data || response };
    } catch (error: any) {
        return { success: false, error: error.message || '장바구니 조회 실패', data: [] };
    }
}

// 3. 장바구니 아이템 삭제
export async function deleteCartItemAction(cartItemId: number): Promise<ActionResponse> {
    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/carts/${cartItemId}` : `/api/v1/carts/${cartItemId}`;
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        await fetchToSpringBoot(endpoint, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}