import { useNavigate } from "react-router";
import { HomeHeader } from "@/components/home/home-header";
import { HomeFooter } from "@/components/home/home-footer";
import { useCart } from "../hooks/useCart";
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 200000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <HomeHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition mb-8"
          >
            <ChevronLeft size={20} />
            Quay lại Trang Chủ
          </button>

          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Hãy thêm một số sản phẩm vào giỏ hàng của bạn
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>

        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition mb-8"
        >
          <ChevronLeft size={20} />
          Tiếp tục mua sắm
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Giỏ Hàng Của Bạn
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-600 transition"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="text-lg font-semibold text-gray-900 hover:text-green-600 transition line-clamp-2 text-left"
                  >
                    {item.name}
                  </button>
                  <p className="text-green-600 font-bold mt-2">
                    {Number(item.price).toLocaleString('vi-VN')}đ
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3 w-fit bg-white border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Total & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <p className="text-lg font-bold text-gray-900">
                    {Number((item.price * item.quantity)).toLocaleString('vi-VN')}đ
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium text-sm transition"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit sticky top-20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-3 mb-6 border-b pb-6">
              <div className="flex justify-between text-gray-700">
                <span>Tổng tiền sản phẩm:</span>
                <span className="font-semibold">
                  {Number(totalPrice).toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">
                  {shippingCost > 0 ? (
                    <>
                      <span className="line-through text-sm text-gray-500">
                        30.000
                      </span>
                      {" "}
                      <span className="text-green-600">Miễn phí</span>
                    </>
                  ) : (
                    <span className="text-green-600">Miễn phí</span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
              <span className="text-2xl font-bold text-green-600">
                {Number(finalTotal).toLocaleString('vi-VN')}đ
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition duration-300 mb-3"
            >
              Thanh Toán
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg font-bold transition duration-300"
            >
              Tiếp tục mua sắm
            </button>

            {/* Info */}
            <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
              <p className="flex gap-2">
                <span>📦</span> Giao hàng nhanh từ 1-3 ngày
              </p>
              <p className="flex gap-2">
                <span>🔒</span> Thanh toán an toàn 100%
              </p>
              <p className="flex gap-2">
                <span>✓</span> Hỗ trợ 24/7 qua hotline
              </p>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default CartPage;

