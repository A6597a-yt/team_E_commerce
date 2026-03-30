import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// 1. Netlify 서버리스 환경 최적화 및 정적 캐싱 방지
export const runtime = 'edge'; // Edge 런타임 사용 (스트리밍 및 타임아웃 관리에 유리)
export const dynamic = 'force-dynamic'; // 항상 실시간 동적 실행

export async function GET(request: NextRequest) {
    // 2. 브라우저가 보낸 HttpOnly 쿠키에서 JWT 추출
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: '인증 토큰이 없습니다.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 3. Spring Boot(백엔드) URL 조립 (토큰을 쿼리 파라미터로 안전하게 전달)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const backendSseUrl = `${baseUrl}/api/notifications/subscribe?token=${token}`;

    try {
        // 4. 백엔드로 스트림 연결 요청 (request.signal을 넘겨 브라우저 종료 시 백엔드 연결도 끊음)
        const response = await fetch(backendSseUrl, {
            method: 'GET',
            signal: request.signal, // 핵심: 클라이언트(브라우저) 연결 상태 동기화
        });

        if (!response.ok) {
            throw new Error(`백엔드 SSE 연결 실패: ${response.status}`);
        }

        // 5. 백엔드에서 받은 ReadableStream을 그대로 클라이언트로 전달 (파이핑)
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream', // SSE 표준 헤더
                'Cache-Control': 'no-cache, no-transform', // 브라우저 캐싱 완벽 차단
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        // 연결 취소(AbortError)는 정상적인 흐름이므로 무시하고, 그 외 에러만 처리
        if (error.name === 'AbortError') {
            console.log('클라이언트에 의해 SSE 연결이 정상적으로 종료되었습니다.');
            return new Response(null, { status: 204 });
        }

        console.error('SSE 프록시 에러:', error);
        return new Response(JSON.stringify({ error: 'SSE 연결 중 오류 발생' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}