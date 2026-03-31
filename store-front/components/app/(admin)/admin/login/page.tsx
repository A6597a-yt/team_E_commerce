import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>백오피스 로그인</CardTitle>
                    <CardDescription>관리자 전용 계정으로 로그인해 주세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* 하드코딩 되어있던 form 태그 대신 LoginForm 컴포넌트 장착 */}
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}