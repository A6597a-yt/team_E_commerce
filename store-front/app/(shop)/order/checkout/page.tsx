'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CartItem } from '@/types/cart';
import api from '@/lib/api';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 임의의 사용자 정보로 폼 초기화
  const [formData, setFormData] = useState({
    ordererName: '홍길동',
    ordererPhone: '010-1234-5678',
    zipcode: '12345',
    address: '서울시 강남구 테헤란로 123',
    detailAddress: '456호',
  });

  // 2. 장바구니 데이터 로드 및 URL 파라미터 필터링
  useEffect(() => {
    const itemIdsParam = searchParams.get('items');
    if (!itemIdsParam) {
      alert('잘못된 접근입니다.');
      router.push('/cart');
      return;
    }

    const targetIds = itemIdsParam.split(',').map(Number);

    const fetchOrderItems = async () => {
      try {
        const response = await api.get('/api/cart');
        const filtered = response.data.filter((item: CartItem) => targetIds.includes(item.productId));
        setOrderItems(filtered);
      } catch (error) {
        console.error('주문 상품 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItems();
  }, [searchParams, router]);

  // 3. 결제 금액 계산 로직 (장바구니와 동일)
  const SHIPPING_THRESHOLD = 50000;
  const SHIPPING_FEE = 3000;

  const totalPrice = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [orderItems]);

  const shippingFee = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = totalPrice + shippingFee;

  // 4. 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 5. 주문 생성 (결제) 요청
  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) return;
    setIsSubmitting(true);

    // 백엔드 DTO(OrderCreateRequest) 스펙에 맞춘 페이로드 구성
    const payload = {
      orderItems: orderItems.map(item => ({
        productOptionId: item.productId, // productId를 productOptionId로 매핑
        quantity: item.quantity
      })),
      ordererName: formData.ordererName,
      ordererPhone: formData.ordererPhone,
      zipcode: formData.zipcode,
      address: formData.address,
      detailAddress: formData.detailAddress
    };

    try {
      // ✅ 수정된 부분: 응답 데이터를 받아오도록 수정
      const response = await api.post('/api/orders', payload);

      // ✅ 수정된 부분: 응답에서 orderId 추출 후 주문 완료 페이지로 리다이렉트
      const createdOrderId = response.data.orderId;

      alert('결제가 완료되었습니다!');
      router.push(`/order/success?orderId=${createdOrderId}`);

    } catch (error) {
      console.error('주문 요청 에러:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center">주문 정보를 불러오는 중...</div>;

  return (
    <div className="container mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 폼 영역 */}
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-2xl font-bold">주문/결제</h1>

        <section className="p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">배송지 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">수령인</label>
              <input type="text" name="ordererName" value={formData.ordererName} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input type="text" name="ordererPhone" value={formData.ordererPhone} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">우편번호</label>
                <input type="text" name="zipcode" value={formData.zipcode} onChange={handleInputChange} className="w-full p-2 border rounded bg-gray-50" readOnly />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">기본 주소</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border rounded bg-gray-50" readOnly />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상세 주소</label>
              <input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleInputChange} className="w-full p-2 border rounded" />
            </div>
          </div>
        </section>

        <section className="p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-4">주문 상품</h2>
          <div className="space-y-4">
            {orderItems.map(item => (
              <div key={item.productId} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                  </div>
                </div>
                <p className="font-bold">{(item.price * item.quantity).toLocaleString()}원</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 결제 요약 영역 */}
      <div className="lg:col-span-1">
        <div className="p-6 border rounded-lg bg-gray-50 sticky top-24">
          <h2 className="text-xl font-bold mb-4">최종 결제 금액</h2>
          <div className="space-y-2 pb-4 border-b">
            <div className="flex justify-between">
              <span>총 상품 금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>배송비</span>
              <span>{shippingFee === 0 ? '무료' : `+ ${shippingFee.toLocaleString()}원`}</span>
            </div>
          </div>
          <div className="flex justify-between py-4 text-xl font-bold">
            <span>총 결제 금액</span>
            <span className="text-red-600">{grandTotal.toLocaleString()}원</span>
          </div>
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isSubmitting ? '결제 처리 중...' : `${grandTotal.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Next.js 앱 라우터에서 useSearchParams를 사용할 때는 Suspense로 감싸는 것을 권장합니다.
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">페이지 준비 중...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}