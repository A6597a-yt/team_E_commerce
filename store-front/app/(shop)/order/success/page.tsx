'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

// 주문 데이터 인터페이스
interface OrderSummary {
    orderId: string;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
}

function OrderSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [orderData, setOrderData] = useState<OrderSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            alert('잘못된 접근입니다.');
            router.push('/');
            return;
        }

        const fetchOrderData = async () => {
            try {
                // 백엔드 단건 조회 API 호출
                const response = await api.get(`/api/orders/${orderId}`);
                setOrderData(response.data);
            } catch (error) {
                console.error('주문 정보 로드 실패:', error);
                alert('주문 정보를 불러오지 못했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId, router]);

    if (isLoading) return <div className="p-20 text-center">주문 정보를 확인하는 중...</div>;
    if (!orderData) return <div className="p-20 text-center text-red-500">주문 내역을 찾을 수 없습니다.</div>;

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">

                {/* 성공 아이콘 및 메시지 */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h2>
                <p className="text-gray-500 mb-8">안전하게 배송해 드리겠습니다.</p>

                {/* 주문 요약 정보 박스 */}
                <div className="bg-gray-50 p-6 rounded-lg text-left space-y-4 mb-8">
                    <div className="flex justify-between border-b border-gray-200 pb-3">
                        <span className="text-gray-600 font-medium">주문 번호</span>
                        <span className="font-bold text-gray-900">{orderData.orderId}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-3">
                        <span className="text-gray-600 font-medium">결제 일시</span>
                        <span className="text-gray-900">{orderData.orderDate}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span className="text-gray-600 font-medium">총 결제 금액</span>
                        <span className="font-bold text-red-600 text-lg">{orderData.totalAmount.toLocaleString()}원</span>
                    </div>
                </div>

                {/* 네비게이션 버튼 그룹 */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                        쇼핑 계속하기
                    </button>
                    <button
                        onClick={() => router.push('/mypage/orders')} // 추후 마이페이지 구현 시 연결
                        className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                        주문 내역 보기
                    </button>
                </div>
            </div>
        </div>
    );
}

// URL 쿼리 파라미터를 사용하므로 Suspense로 감싸줍니다.
export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">페이지를 준비 중입니다...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}