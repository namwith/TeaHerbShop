import { CreditCard, Banknote, Wallet, Package } from "lucide-react";

interface PaymentMethodsProps {
  selectedMethod: "credit_card" | "bank_transfer" | "e_wallet" | "cod";
  onMethodChange: (method: "credit_card" | "bank_transfer" | "e_wallet" | "cod") => void;
  cardInfo: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
  };
  onCardInfoChange: (info: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
  }) => void;
}

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  cardInfo,
  onCardInfoChange,
}: PaymentMethodsProps) {
  const paymentOptions = [
    {
      id: "credit_card",
      label: "Thẻ Tín Dụng/Ghi Nợ",
      icon: CreditCard,
      description: "Visa, Mastercard, JCB",
    },
    {
      id: "bank_transfer",
      label: "Chuyển Khoản Ngân Hàng",
      icon: Banknote,
      description: "Chuyển khoản vào tài khoản của cửa hàng",
    },
    {
      id: "e_wallet",
      label: "Ví Điện Tử",
      icon: Wallet,
      description: "Momo, ZaloPay, Airpay",
    },
    {
      id: "cod",
      label: "Thanh Toán Khi Nhận Hàng",
      icon: Package,
      description: "COD - Miễn phí thanh toán trực tuyến",
    },
  ];

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <CreditCard size={24} />
        Phương Thức Thanh Toán
      </h2>

      {/* Payment Options */}
      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          return (
            <label
              key={option.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedMethod === option.id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 hover:border-green-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={option.id}
                checked={selectedMethod === option.id}
                onChange={() =>
                  onMethodChange(
                    option.id as
                      | "credit_card"
                      | "bank_transfer"
                      | "e_wallet"
                      | "cod"
                  )
                }
                className="w-4 h-4 text-green-600"
              />
              <Icon size={24} className="ml-4 text-gray-600" />
              <div className="ml-4 flex-1">
                <p className="font-semibold text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Card Info Form */}
      {selectedMethod === "credit_card" && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
          <h3 className="font-bold text-gray-900">Thông Tin Thẻ</h3>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số Thẻ *
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardInfo.cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, "");
                const formatted = value
                  .match(/.{1,4}/g)
                  ?.join(" ")
                  .slice(0, 19);
                onCardInfoChange({
                  ...cardInfo,
                  cardNumber: formatted || "",
                });
              }}
              maxLength={19}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Card Holder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên Chủ Thẻ *
            </label>
            <input
              type="text"
              placeholder="TRAN VAN A"
              value={cardInfo.cardName}
              onChange={(e) =>
                onCardInfoChange({
                  ...cardInfo,
                  cardName: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hạn sử dụng *
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardInfo.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2, 4);
                  }
                  onCardInfoChange({
                    ...cardInfo,
                    expiry: value.slice(0, 5),
                  });
                }}
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                placeholder="123"
                value={cardInfo.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                  onCardInfoChange({
                    ...cardInfo,
                    cvv: value,
                  });
                }}
                maxLength={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 flex gap-2">
            <span>ℹ️</span>
            <span>Đây là form demo. Thông tin không được lưu trữ.</span>
          </div>
        </div>
      )}

      {/* Bank Transfer Info */}
      {selectedMethod === "bank_transfer" && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-3">
          <h3 className="font-bold text-blue-900">Thông Tin Chuyển Khoản</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <span className="font-semibold">Ngân hàng:</span> Techcombank
            </p>
            <p>
              <span className="font-semibold">Số tài khoản:</span> 0123456789
            </p>
            <p>
              <span className="font-semibold">Chủ tài khoản:</span> TeaHerbShop
            </p>
            <p className="mt-3 border-t border-blue-200 pt-3">
              Vui lòng ghi nội dung: <span className="font-bold">TeaHerbShop [Tên khách hàng]</span>
            </p>
          </div>
        </div>
      )}

      {/* E-Wallet Info */}
      {selectedMethod === "e_wallet" && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 space-y-3">
          <h3 className="font-bold text-green-900">Ví Điện Tử Được Hỗ Trợ</h3>
          <div className="flex flex-wrap gap-4 text-center text-sm">
            <div className="flex-1 min-w-fit">
              <div className="text-2xl">📱</div>
              <p className="font-semibold text-green-900">Momo</p>
            </div>
            <div className="flex-1 min-w-fit">
              <div className="text-2xl">📲</div>
              <p className="font-semibold text-green-900">ZaloPay</p>
            </div>
            <div className="flex-1 min-w-fit">
              <div className="text-2xl">✈️</div>
              <p className="font-semibold text-green-900">Airpay</p>
            </div>
          </div>
          <p className="text-xs text-green-800 mt-3">
            Sau khi click "Xác Nhận Đơn Hàng", bạn sẽ được chuyển đến trang thanh toán của ví điện tử.
          </p>
        </div>
      )}

      {/* COD Info */}
      {selectedMethod === "cod" && (
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 space-y-3">
          <h3 className="font-bold text-amber-900">Thanh Toán Khi Nhận Hàng</h3>
          <div className="text-sm text-amber-800 space-y-2">
            <p>✓ Thanh toán tiền mặt khi nhận hàng</p>
            <p>✓ Miễn phí thanh toán trực tuyến</p>
            <p>✓ Kiểm tra hàng trước khi thanh toán</p>
            <p className="mt-3 border-t border-amber-200 pt-3">
              Lưu ý: Phí vận chuyển sẽ được tính thêm nếu đơn hàng dưới 200.000 ₫
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
