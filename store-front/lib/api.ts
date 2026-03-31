import axios from 'axios';

// ✅ 백엔드 서버 가동 시 이 값을 false로 변경하면 즉시 진짜 API 통신으로 전환됩니다.
const IS_MOCK_MODE = true;

// ---------------------------------------------------------
// 1. 실제 통신용 Axios 인스턴스 (기존 코드와 완벽 동일)
// ---------------------------------------------------------
const realApi = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

realApi.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

realApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                alert('로그인이 필요하거나 세션이 만료되었습니다.');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ---------------------------------------------------------
// 2. 가짜(Mock) 데이터 및 모의 통신 객체 구성
// ---------------------------------------------------------
const mockCartItems = [
    {
        productId: 1,
        name: 'M4A1 전동건 (에어소프트건)',
        price: 350000,
        quantity: 1,
        imageUrl: 'https://via.placeholder.com/150?text=Airsoft',
    },
    {
        productId: 2,
        name: '전술 방탄조끼 (장구류)',
        price: 85000,
        quantity: 2,
        imageUrl: 'https://via.placeholder.com/150?text=Tactical+Gear',
    },
    {
        productId: 3,
        name: '건담 1/144 (프라모델)',
        price: 32000,
        quantity: 1,
        imageUrl: 'https://via.placeholder.com/150?text=Plastic+Model',
    },
];

// 프론트엔드의 컴포넌트들이 실제 axios인 것처럼 속아 넘어가도록 구조를 맞춤
const mockApi = {
    get: async (url: string) => {
        console.log(`[MOCK GET] ${url}`);
        await new Promise(r => setTimeout(r, 300));

        // 1. 장바구니
        if (url === '/api/cart') return { data: [] }; // 초기값 빈 배열

        // 2. 내 정보 조회
        if (url === '/api/members/me') {
            return { data: { email: 'user@example.com', name: '홍길동', phone: '010-1234-5678' } };
        }

        // 3. 내 주문 목록 조회 (마이페이지용)
        if (url === '/api/orders/me') {
            return {
                data: [
                    { orderId: 'ORD-1001', orderDate: '2026-03-25', totalAmount: 685000, status: 'SHIPPING' },
                    { orderId: 'ORD-1002', orderDate: '2026-03-28', totalAmount: 125000, status: 'DELIVERED' }
                ]
            };
        }

        // 4. 1:1 문의 내역 조회
        if (url === '/api/inquiries') {
            return {
                data: [
                    { id: 1, title: '배송 문의드립니다.', createdAt: '2026-03-29', status: 'ANSWERED' }
                ]
            };
        }

        // 5. 주문 단건 조회 (기존 유지)
        const orderMatch = url.match(/^\/api\/orders\/(.+)$/);
        if (orderMatch) return { data: { orderId: orderMatch[1], totalAmount: 435000, orderDate: '2026-03-31' } };

        return { data: {} };
    },

    post: async (url: string, data?: any) => {
        console.log(`[MOCK POST] ${url}`, data);
        await new Promise(r => setTimeout(r, 600));

        if (url === '/login') return { data: { accessToken: 'fake-jwt-777' } };
        if (url === '/api/members/signup') return { data: { success: true } };
        if (url === '/api/orders') return { data: { orderId: `ORD-${Date.now()}` } };

        // ✅ 6. 1:1 문의 등록 (FormData 대응)
        if (url === '/api/inquiries') {
            // FormData일 경우와 일반 객체일 경우를 모두 고려
            const title = data instanceof FormData ? data.get('title') : data.title;
            console.log('문의 등록 완료:', title);
            return { data: { success: true } };
        }

        return { data: {} };
    },

    patch: async (url: string, data?: any) => {
        console.log(`[MOCK PATCH] ${url} 호출됨`, data);
        if (url === '/api/cart') {
            return { data: { message: '수량 변경 성공' } };
        }
        return { data: {} };
    },

    delete: async (url: string) => {
        console.log(`[MOCK DELETE] ${url} 호출됨`);
        if (url === '/api/cart') {
            return { data: { message: '삭제 성공' } };
        }
        return { data: {} };
    },
};

// ---------------------------------------------------------
// 3. 모드에 따라 반환할 객체 결정
// ---------------------------------------------------------
// TypeScript 에러 방지를 위해 any 타입으로 캐스팅하여 내보냅니다.
const api = IS_MOCK_MODE ? (mockApi as any) : realApi;

export default api;