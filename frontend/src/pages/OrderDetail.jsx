// src/pages/OrderDetail.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OrderDetail = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // Lấy mã đơn hàng từ URL
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const themeColor = "#f97316";

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/orders/me/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data.success) {
          setOrderData(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng", err);
        setError(
          err.response?.data?.message || "Không thể lấy thông tin đơn hàng.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token && id) fetchOrderDetails();
  }, [token, id]);

  // Hàm tự động tô màu cho Trạng thái đơn hàng (sao chép từ OrderHistory)
  const getStatusBadge = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-warning text-dark";
      case "Đang xử lý":
        return "bg-info text-dark";
      case "Đã giao":
        return "bg-success";
      case "Đã hủy":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 mb-5 text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2 text-muted">Đang lấy dữ liệu chi tiết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 mb-5 text-center py-5">
        <h4 className="text-danger mb-3">❌ Lỗi: {error}</h4>
        <Link to="/orders" className="btn btn-outline-secondary">
          Quay lại Lịch sử đơn hàng
        </Link>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mt-5 mb-5 text-center py-5">
        <h4 className="text-muted mb-3">Không tìm thấy dữ liệu đơn hàng.</h4>
        <Link to="/orders" className="btn btn-outline-secondary">
          Quay lại Lịch sử đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "70vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold" style={{ color: themeColor }}>
          Chi tiết đơn hàng #{orderData.OrderID}
        </h3>
        <Link to="/orders" className="btn btn-outline-secondary fw-bold">
          <i className="bi bi-arrow-left"></i> Quay lại Lịch sử
        </Link>
      </div>

      {/* --- KHU VỰC THÔNG TIN CHUNG --- */}
      <div className="card shadow-sm border-0 mb-4 p-4">
        <div className="row g-4 text-center">
          <div className="col-md-4 border-end">
            <h6 className="text-muted mb-2">Thông tin khách hàng</h6>
            <h5 className="fw-bold mb-1">
              {orderData.UserFullName || orderData.Username}
            </h5>
            <p className="mb-0 text-muted">
              {orderData.ReceiverPhone || "Không có SĐT"}
            </p>
          </div>
          <div className="col-md-4 border-end">
            <h6 className="text-muted mb-2">Thanh toán & Giao hàng</h6>
            <h5 className="fw-bold mb-1">{orderData.PaymentMethod || "COD"}</h5>
            <p className="mb-0 text-muted text-break">
              {orderData.ShippingAddress || "Không có địa chỉ"}
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="text-muted mb-2">Trạng thái</h6>
            <h5 className="fw-bold mb-1">
              {new Date(orderData.OrderDate).toLocaleDateString("vi-VN")}
            </h5>
            <span
              className={`badge ${getStatusBadge(orderData.Status)} px-3 py-2 mt-1 fs-6`}
            >
              {orderData.Status}
            </span>
          </div>
        </div>
      </div>

      {/* --- KHU VỰC TÓM TẮT ĐƠN HÀNG (SẢN PHẨM) --- */}
      <h4 className="fw-bold mb-3 mt-5">🛒 Tóm tắt đơn hàng</h4>
      <div className="card shadow-sm border-0">
        <div className="card-body p-0 table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4">Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items &&
                orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4">
                      <div className="d-flex align-items-center">
                        {item.ImageURL && (
                          <img
                            src={`http://localhost:3000${item.ImageURL}`}
                            alt={item.Name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "5px",
                              marginRight: "15px",
                            }}
                          />
                        )}
                        <strong>{item.Name}</strong>
                      </div>
                    </td>
                    <td className="text-muted">
                      {item.Price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="fw-bold">x{item.Quantity}</td>
                    <td className="text-danger fw-bold fs-6">
                      {(item.Price * item.Quantity).toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white border-0 py-3 px-4 text-end">
          <strong className="fs-5">Tổng tiền:</strong>
          <strong className="fs-3 text-danger ms-3">
            {orderData.TotalAmount.toLocaleString("vi-VN")} đ
          </strong>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
