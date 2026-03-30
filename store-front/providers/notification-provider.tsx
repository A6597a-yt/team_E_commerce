'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
    // 연결 상태 추적용 Ref (렌더링에 영향을 주지 않음)
    const isConnected = useRef(false);

    useEffect(() => {
        // 1. Next.js 프록시 라우트로 SSE 연결 시도
        const eventSource = new EventSource('/api/sse');

        eventSource.onopen = () => {
            isConnected.current = true;
            console.log('실시간 알림 서버와 연결되었습니다.');
        };

        // 2. 범용 메시지 수신 이벤트 (백엔드 스펙 미정에 대비한 유연한 처리)
        eventSource.onmessage = (event) => {
            try {
                // 수신된 데이터를 JSON으로 파싱 시도
                const data = JSON.parse(event.data);

                // 데이터 객체 내부에 title이나 message 속성이 있다고 가정 (임시 규격)
                if (data.title || data.message) {
                    toast(data.title || '알림', {
                        description: data.message,
                        duration: 5000, // 알림 지속 시간 5초
                    });
                } else {
                    // 속성이 명확하지 않은 JSON 객체일 경우
                    toast('새로운 알림이 도착했습니다.');
                }
            } catch (error) {
                // JSON 파싱 실패 시, 순수 문자열로 가정하고 화면에 노출
                toast(event.data);
            }
        };

        // 3. 에러 및 재연결 제어
        eventSource.onerror = () => {
            // Netlify 서버리스 타임아웃으로 인한 끊김 시 EventSource가 자동으로 재연결을 시도합니다.
            // 심각한 연결 거부(401 등)로 인해 상태가 CLOSED(2)로 변한 경우에만 로깅합니다.
            if (eventSource.readyState === EventSource.CLOSED) {
                console.log('실시간 알림 연결이 종료되었습니다.');
            }
        };

        // 4. 컴포넌트 언마운트 시 클린업 (메모리 누수 및 백엔드 좀비 커넥션 방지)
        return () => {
            eventSource.close();
            isConnected.current = false;
        };
    }, []);

    return <>{children}</>;
}