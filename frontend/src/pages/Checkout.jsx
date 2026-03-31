import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// 1. IMPORT API
import api from "../api/axios.js";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

const Checkout = () => {
  const { token } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullName: "",
    Phone: "",
    Province: "",
    District: "",
    Ward: "",
    Street: "",
    PaymentMethod: "COD",
  });

  const [isLoading, setIsLoading] = useState(false);
  const themeColor = "#f97316";

  const totalAmount = cart.reduce(
    (total, item) => total + item.Price * item.quantity,
    0,
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 2. GỌI API CỰC NGẮN
        const res = await api.get("/users/profile");
        if (res.data.success) {
          const data = res.data.data;
          setFormData((prev) => ({
            ...prev,
            FullName: data.FullName || "",
            Phone: data.Phone || "",
          }));
        }
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) return toast.error("Giỏ hàng của bạn đang trống!");
    if (!/^0\d{9}$/.test(formData.Phone)) {
      return toast.warning(
        "Số điện thoại không hợp lệ! (Phải 10 số, bắt đầu bằng số 0)",
      );
    }

    const fullShippingAddress = `${formData.Street}, ${formData.Ward}, ${formData.District}, ${formData.Province}`;
    setIsLoading(true);

    try {
      const payload = {
        cartItems: cart,
        totalAmount: totalAmount,
        shippingAddress: fullShippingAddress,
        receiverPhone: formData.Phone,
        paymentMethod: formData.PaymentMethod,
      };

      // 3. GỌI API TẠO ĐƠN HÀNG (Không cần nhét header token)
      const res = await api.post("/orders", payload);

      if (res.data.success) {
        toast.success("🎉 Đặt hàng thành công! Cảm ơn bạn.");
        clearCart();
        navigate("/orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đặt hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div
        className="container text-center mt-5 mb-5"
        style={{ minHeight: "60vh" }}
      >
        <h3 className="text-muted mb-4">🛒 Giỏ hàng của bạn đang trống</h3>
        <button
          className="btn text-white fw-bold px-4 py-2"
          style={{ backgroundColor: themeColor }}
          onClick={() => navigate("/")}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5" style={{ minHeight: "70vh" }}>
      <h3 className="fw-bold mb-4" style={{ color: themeColor }}>
        Thanh Toán Đơn Hàng
      </h3>
      <div className="row g-4">
        <div className="col-lg-7">
          <CheckoutForm
            formData={formData}
            setFormData={setFormData}
            handlePlaceOrder={handlePlaceOrder}
          />
        </div>
        <div className="col-lg-5">
          <OrderSummary
            cart={cart}
            totalAmount={totalAmount}
            isLoading={isLoading}
            themeColor={themeColor}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
