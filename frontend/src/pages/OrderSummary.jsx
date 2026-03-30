import React from "react";

const OrderSummary = ({ cart, totalAmount, isLoading, themeColor }) => {
  return (
    <div
      className="card shadow-sm border-0 p-4"
      style={{ backgroundColor: "#fffcf9" }}
    >
      <h5 className="fw-bold mb-3 border-bottom pb-2">🛍️ Tóm tắt đơn hàng</h5>

      <div className="mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
        {cart.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center mb-3 pe-2"
          >
            <div className="d-flex align-items-center">
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  backgroundColor: "#eee",
                  borderRadius: "8px",
                  marginRight: "12px",
                  backgroundImage: `url(http://localhost:3000${item.ImageURL})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div>
                <p className="mb-0 fw-bold small text-dark">{item.Name}</p>
                <span className="text-muted small">SL: {item.quantity}</span>
              </div>
            </div>
            {/* Format chuẩn tiền tệ */}
            <span className="fw-bold text-danger">
              {Math.round(item.Price * item.quantity).toLocaleString("vi-VN")} đ
            </span>
          </div>
        ))}
      </div>

      <div className="border-top pt-3 mt-2">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Tạm tính:</span>
          <span className="fw-bold">
            {Math.round(totalAmount).toLocaleString("vi-VN")} đ
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Phí vận chuyển:</span>
          <span className="text-success fw-bold">Miễn phí</span>
        </div>
        <div className="d-flex justify-content-between mb-4 mt-3 border-top pt-3">
          <strong className="fs-5">Tổng cộng:</strong>
          <strong className="fs-4 text-danger">
            {Math.round(totalAmount).toLocaleString("vi-VN")} đ
          </strong>
        </div>

        {/* Nút Submit kích hoạt form bên trái thông qua ID 'checkout-form' */}
        <button
          type="submit"
          form="checkout-form"
          className="btn text-white w-100 fw-bold py-3 fs-5 shadow-sm"
          style={{ backgroundColor: themeColor, borderRadius: "10px" }}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
