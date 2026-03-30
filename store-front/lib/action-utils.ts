import { cookies } from 'next/headers';

// 1. 프론트엔드 - 백엔드(Next.js) 간 Server Action 공통 응답 규격
export type ActionResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
};

// 2. Spring Boot API 통신을 위한 범용 Fetcher (JWT 자동 주입)
export async function fetchToSpringBoot<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value; // HttpOnly 쿠키에서 토큰 추출

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    // 토큰이 존재하면 Authorization 헤더에 주입
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // 백엔드 API 호출 (환경 변수에 Spring Boot 주소 세팅 필요)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // 401, 403, 500 등 서버 에러 발생 시 처리
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '서버 요청 중 오류가 발생했습니다.');
    }

    return response.json();
}