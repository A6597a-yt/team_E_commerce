'use server';

import { cookies } from 'next/headers';
import { fetchToSpringBoot, ActionResponse } from '@/lib/action-utils';

export async function createOrderAction(formData: FormData): Promise<ActionResponse> {
    const receiverName = formData.get('receiverName') as string;
    const receiverPhone = formData.get('receiverPhone') as string;
    const address = formData.get('address') as string;
    // 실제 결제 연동 시에는 아임포트/토스페이먼츠 등의 결제 키(paymentKey)를 함께 넘겨야 합니다.

    try {
        const endpoint = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api/v1/orders` : '/api/v1/orders';
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        if (!token) return { success: false, error: '로그인이 필요합니다.' };

        // 백엔드 OrderCreateRequest DTO 구조에 맞게 수정 필요
        const payload = {
            receiverName,
            receiverPhone,
            shippingAddress: address,
        };

        const response = await fetchToSpringBoot(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return { success: true };
    } catch (error: any) {
        // 백엔드 공통 에러 규약(Error Envelope) 처리
        return { success: false, error: error.message || '주문 처리에 실패했습니다. (재고 부족 등)' };
    }
}