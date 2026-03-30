'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrderAction } from '@/features/order/actions';

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        const formData = new FormData(e.currentTarget);
        const res = await createOrderAction(formData);

        if (res.success) {
            alert('주문이 완료되었습니다.');
            // 주문 완료 페이지나 내 주문 내역으로 이동
            router.push('/');
        } else {
            // 백엔드에서 내려준 에러 메시지 (예: "해당 상품의 재고가 부족합니다.")
            setErrorMsg(res.error || '결제 중 오류가 발생했습니다.');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">주문/결제</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">배송지 정보</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">수령인</label>
                            <input name="receiverName" type="text" required className="mt-1 block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600" placeholder="이름을 입력하세요" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">연락처</label>
                            <input name="receiverPhone" type="text" required className="mt-1 block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600" placeholder="010-0000-0000" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">배송 주소</label>
                            <input name="address" type="text" required className="mt-1 block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600" placeholder="상세 주소를 입력하세요" />
                        </div>
                    </div>
                </section>

                {errorMsg && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm">
                        {errorMsg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? '결제 처리 중...' : '결제하기'}
                </button>
            </form>
        </div>
    );
}