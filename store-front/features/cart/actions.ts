'use server';

import { revalidateTag } from 'next/cache';
import { fetchToSpringBoot, ActionResponse } from '@/lib/action-utils';

export async function addToCartAction(productId: string): Promise<ActionResponse> {
    try {
        await fetchToSpringBoot('/api/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity: 1 }),
        });

        revalidateTag('cart', { expire: 0 });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}