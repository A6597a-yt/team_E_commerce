'use client';

import { useOptimistic } from 'react';
import { Button } from '@/components/ui/button';
import { addToCartAction } from '@/features/cart/actions';
import { useActionToast } from '@/hooks/use-action-toast';

interface AddToCartButtonProps {
    productId: string;
    initialQuantity: number; // 👈 Injected from Server Component (Product Details)
}

export default function AddToCartButton({ productId, initialQuantity }: AddToCartButtonProps) {
    // 1. Optimistic UI: Immediately increment by 1
    const [optimisticQuantity, addOptimisticQuantity] = useOptimistic(
        initialQuantity,
        (state, amount: number) => state + amount // (currentState, addedAmount)
    );

    // 2. Setup the Common Toast Hook (custom success message)
    const { execute, isPending } = useActionToast(
        addToCartAction,
        "장바구니에 상품이 추가되었습니다." // 👈 Custom success message
    );

    const handleAddToCart = () => {
        // 1. Immediate UI update (+1)
        addOptimisticQuantity(1);

        // 2. Background server action execution
        execute(productId);
    };

    return (
        <div className="flex flex-col gap-2">
            <Button
                onClick={handleAddToCart}
                disabled={isPending} // 👈 Disable while pending to prevent double clicks
                className="w-full sm:w-auto"
            >
                {isPending ? "담는 중..." : "장바구니 담기"}
            </Button>
            {optimisticQuantity > 0 && (
                <span className="text-sm text-gray-500 text-right">
                    현재 장바구니에 {optimisticQuantity}개 담겨있습니다.
                </span>
            )}
        </div>
    );
}