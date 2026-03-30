import { useTransition } from 'react';
import { toast } from 'sonner';
import { ActionResponse } from '@/lib/action-utils';

export function useActionToast<T>(
    action: (payload: T) => Promise<ActionResponse>,
    successMessage: string = "성공적으로 처리되었습니다."
) {
    const [isPending, startTransition] = useTransition();

    const execute = (payload: T) => {
        startTransition(async () => {
            const result = await action(payload);

            if (result.success) {
                toast.success(successMessage); // 👈 Direct method call
            } else {
                toast.error(result.error || "알 수 없는 오류가 발생했습니다."); // 👈 Implicit destructive variant
            }
        });
    };

    return { execute, isPending };
}