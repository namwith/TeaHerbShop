import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { HomeHeader } from "@/components/home/home-header";
import { HomeFooter } from "@/components/home/home-footer";
import { useCart } from "../hooks/useCart";
import { ChevronLeft, MapPin, CreditCard, Truck, Lock } from "lucide-react";
import { ShippingForm } from "@/components/checkout/shipping-form";
import { PaymentMethods } from "@/components/checkout/payment-methods";
import { OrderSummary } from "@/components/checkout/order-summary";
import { toast } from "sonner";
import { createOrder } from "../services/orderService";
import { getProfile } from "@/services/userService";
// removed login-form import

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();

  const [step, setStep] = useState<"auth" | "shipping" | "payment" | "review">("shipping");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "bank_transfer" | "e_wallet" | "cod"
  >("credit_card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 200000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getProfile();
          if (res.data?.success) {
            const user = res.data.data;
            setShippingInfo((prev) => ({
              ...prev,
              fullName: user.FullName || "",
              email: user.Email || "",
              phone: user.Phone || "",
              address: user.Address || "",
            }));
          }
        } catch (e) {
          console.error("Lỗi lấy thông tin cá nhân:", e);
        }
        setStep("shipping");
      } else {
        setStep("auth");
      }
    };
    fetchUser();
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <HomeHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Quay lại Trang Chủ
          </button>
        </div>
        <HomeFooter />
      </div>
    );
  }



  const handleShippingSubmit = (data: typeof shippingInfo) => {
    setShippingInfo(data);
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === "credit_card") {
      if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiry || !cardInfo.cvv) {
        toast.error("Vui lòng điền đầy đủ thông tin thẻ");
        return;
      }
    }
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmOrder = async () => {
    try {
      const payload = {
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: finalTotal,
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`,
        receiverPhone: shippingInfo.phone,
        paymentMethod,
      };

      await createOrder(payload);
      toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua hàng");
      clearCart();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition mb-6"
        >
          <ChevronLeft size={20} />
          Quay lại Giỏ Hàng
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Thanh Toán
        </h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center flex-1 ${step === "shipping" || step === "payment" || step === "review" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step === "shipping" || step === "payment" || step === "review" ? "bg-green-600 text-white" : "bg-gray-300"}`}>
                1
              </div>
              <span className="text-sm font-semibold">Địa chỉ</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step === "payment" || step === "review" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className={`flex flex-col items-center flex-1 ${step === "payment" || step === "review" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step === "payment" || step === "review" ? "bg-green-600 text-white" : "bg-gray-300"}`}>
                2
              </div>
              <span className="text-sm font-semibold">Thanh Toán</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step === "review" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className={`flex flex-col items-center flex-1 ${step === "review" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step === "review" ? "bg-green-600 text-white" : "bg-gray-300"}`}>
                3
              </div>
              <span className="text-sm font-semibold">Xác Nhận</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 0: Auth */}
            {step === "auth" && (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 text-center">
                {/* Login Section */}
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  <h3 className="text-xl font-bold mb-4 text-green-700">ĐĂNG NHẬP</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-[250px]">
                    Thực hiện đăng nhập để thông tin giao hàng được điền tự động ngay.
                  </p>
                  <button
                    onClick={() => navigate("/login", { state: { from: "/checkout" } })}
                    className="w-full md:w-auto border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition"
                  >
                    Đăng nhập ngay
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-gray-200" />
                <div className="md:hidden h-px w-full bg-gray-200" />

                {/* Guest Section */}
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">KHÔNG CẦN ĐĂNG NHẬP</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-[250px]">
                    Bạn có thể tiếp tục mua hàng và thanh toán mà không cần có tài khoản.
                  </p>
                  <button
                    onClick={() => setStep("shipping")}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                  >
                    Thanh toán (Guest)
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === "shipping" && (
              <ShippingForm
                initialData={shippingInfo}
                onSubmit={handleShippingSubmit}
              />
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="space-y-6">
                {/* Shipping Info Summary */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Thông Tin Giao Hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold">Tên:</p>
                      <p>{shippingInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Điện thoại:</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-semibold">Địa chỉ:</p>
                      <p>
                        {shippingInfo.address}, {shippingInfo.ward},{" "}
                        {shippingInfo.district}, {shippingInfo.city}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("shipping")}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Sửa thông tin
                  </button>
                </div>

                {/* Payment Methods */}
                <PaymentMethods
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  cardInfo={cardInfo}
                  onCardInfoChange={setCardInfo}
                />

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("shipping")}
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-bold transition"
                  >
                    Quay Lại
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
                  >
                    Tiếp Tục
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === "review" && (
              <div className="space-y-6">
                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Thông Tin Giao Hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold">Tên:</p>
                      <p>{shippingInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Email:</p>
                      <p>{shippingInfo.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Điện thoại:</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Phương thức giao:</p>
                      <p className="flex items-center gap-2">
                        <Truck size={16} /> Giao hàng nhanh
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-semibold">Địa chỉ giao:</p>
                      <p>
                        {shippingInfo.address}, {shippingInfo.ward},{" "}
                        {shippingInfo.district}, {shippingInfo.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard size={20} />
                    Phương Thức Thanh Toán
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {paymentMethod === "credit_card" && (
                      <p>💳 Thẻ Tín Dụng - {cardInfo.cardNumber.slice(-4)}</p>
                    )}
                    {paymentMethod === "bank_transfer" && (
                      <p>🏦 Chuyển khoản ngân hàng</p>
                    )}
                    {paymentMethod === "e_wallet" && (
                      <p>👛 Ví điện tử (Momo, ZaloPay, ...)</p>
                    )}
                    {paymentMethod === "cod" && (
                      <p>📦 Thanh toán khi nhận hàng</p>
                    )}
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex gap-3">
                  <Lock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold">Thanh toán an toàn</p>
                    <p>Thông tin của bạn được mã hóa và bảo vệ hoàn toàn.</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-bold transition"
                  >
                    Quay Lại
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                  >
                    <Lock size={18} />
                    Xác Nhận Đơn Hàng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={cart}
              totalPrice={totalPrice}
              shippingCost={shippingCost}
              finalTotal={finalTotal}
            />
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default CheckoutPage;
