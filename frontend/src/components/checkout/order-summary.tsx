import { Package } from "lucide-react";
import type { CartItem } from "@/context/CartContext";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  shippingCost: number;
  finalTotal: number;
}

export function OrderSummary({
  items,
  totalPrice,
  shippingCost,
  finalTotal,
}: OrderSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit sticky top-20 space-y-6">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Package size={20} />
        Tóm Tắt Đơn Hàng
      </h3>

      {/* Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 pb-3 border-b">
            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-gray-600">
                {item.quantity} x {Number(item.price).toLocaleString('vi-VN')}đ
              </p>
            </div>
            <p className="text-sm font-bold text-green-600 flex-shrink-0">
              {Number((item.price * item.quantity)).toLocaleString('vi-VN')}đ
            </p>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-t border-b">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Tổng tiền sản phẩm:</span>
          <span className="font-semibold">{Number(totalPrice).toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold">
            {shippingCost > 0 ? (
              <>
                <span className="line-through text-xs text-gray-500">
                  30.000
                </span>{" "}
                <span className="text-green-600">Miễn phí</span>
              </>
            ) : (
              <span className="text-green-600">Miễn phí</span>
            )}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
        <span className="text-3xl font-bold text-green-600">
          {Number(finalTotal).toLocaleString('vi-VN')}đ
        </span>
      </div>

      {/* Benefits */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2 text-sm text-green-900">
        <p className="flex gap-2">
          <span>✓</span> Giao hàng nhanh từ 1-3 ngày
        </p>
        <p className="flex gap-2">
          <span>✓</span> Hoàn tiền 100% nếu không hài lòng
        </p>
        <p className="flex gap-2">
          <span>✓</span> Hỗ trợ 24/7 trước và sau bán hàng
        </p>
      </div>
    </div>
  );
}

