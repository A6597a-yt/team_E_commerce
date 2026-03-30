'use client';

import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { adminLoginAction } from '@/features/admin/actions';
import { useActionToast } from '@/hooks/use-action-toast';

export default function LoginForm() {
    const router = useRouter();

    // 커스텀 훅을 사용하여 Server Action 연결 및 성공 메시지 생략 (대신 페이지 이동)
    const { execute, isPending } = useActionToast(
        adminLoginAction,
        "로그인 성공" // 이 메시지는 페이지가 즉시 이동하므로 거의 보이지 않습니다.
    );

    // 폼 제출 핸들러 (formData를 그대로 Action에 넘김)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Server Action 수동 호출 후 결과에 따라 라우팅 처리
        const result = await adminLoginAction(formData);

        if (result.success) {
            router.push('/admin/dashboard'); // 성공 시 대시보드로 강제 이동
            router.refresh(); // 미들웨어가 새로운 쿠키를 즉시 인식하도록 새로고침
        } else {
            // 실패 시, 기존에 등록된 Sonner 토스트가 에러를 띄웁니다.
            execute(formData);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="adminId">아이디</Label>
                <Input id="adminId" name="adminId" placeholder="admin" required disabled={isPending} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" name="password" type="password" required disabled={isPending} />
            </div>
            <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "로그인 중..." : "로그인"}
            </Button>
        </form>
    );
}