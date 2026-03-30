import { CartItem } from '@/types/cart';

interface Props {
    item: CartItem;
    onUpdate: (id: number, qty: number) => void;
    onDelete: (id: number) => void;
}

export default function CartItemRow({ item, onUpdate, onDelete }: Props) {
    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">{item.price.toLocaleString()}원</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdate(item.productId, item.quantity - 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                >-</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                    onClick={() => onUpdate(item.productId, item.quantity + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                >+</button>
            </div>
            <div className="text-right min-w-[100px]">
                <p className="font-bold">{(item.price * item.quantity).toLocaleString()}원</p>
                <button
                    onClick={() => onDelete(item.productId)}
                    className="text-sm text-red-500 hover:underline mt-1"
                >삭제</button>
            </div>
        </div>
    );
}