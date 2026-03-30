import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // 💡 임시 우회(Bypass): 모든 접근을 허용합니다.
    // TODO: 추후 Spring Boot 백엔드 로그인 API 연동이 완료되면, 이 줄을 지우고 아래 주석을 해제하세요.
    return NextResponse.next();

    /* ======== [기존 방어벽 로직 보존 영역] ========
    const { pathname } = request.nextUrl;
  
    if (pathname.startsWith('/admin')) {
      const adminToken = request.cookies.get('adminToken')?.value;
  
      if (pathname === '/admin/login') {
        if (adminToken) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
      }
  
      if (!adminToken) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  
    return NextResponse.next();
    ============================================= */
}

export const config = {
    matcher: ['/admin/:path*'],
};