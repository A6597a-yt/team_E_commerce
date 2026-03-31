interface Props {
    totalPrice: number;
    onCheckout: () => void;
}

export default function CartSummary({ totalPrice, onCheckout }: Props) {
    const SHIPPING_THRESHOLD = 50000;
    const SHIPPING_FEE = 3000;

    const shippingFee = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotal = totalPrice + shippingFee;

    return (
        <div className="p-6 border rounded-lg bg-gray-50 sticky top-24">
            <h2 className="text-xl font-bold mb-4">결제 정보</h2>
            <div className="space-y-2 pb-4 border-b">
                <div className="flex justify-between">
                    <span>선택 상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                    <span>배송비</span>
                    <span>{shippingFee === 0 ? '무료' : `+ ${shippingFee.toLocaleString()}원`}</span>
                </div>
                {shippingFee > 0 && totalPrice > 0 && (
                    <p className="text-xs text-blue-600 text-right">
                        {(SHIPPING_THRESHOLD - totalPrice).toLocaleString()}원 추가 구매 시 무료배송
                    </p>
                )}
            </div>
            <div className="flex justify-between py-4 text-lg font-bold">
                <span>총 결제 예상 금액</span>
                <span className="text-red-600">{grandTotal.toLocaleString()}원</span>
            </div>
            <button
                onClick={onCheckout}
                className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition"
            >
                주문하기
            </button>
        </div>
    );
}