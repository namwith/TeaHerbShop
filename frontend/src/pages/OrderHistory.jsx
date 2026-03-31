// src/pages/OrderHistory.jsx

import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const statuses = [
    "Tất cả",
    "Chờ xác nhận",
    "Đang xử lý",
    "Đã giao",
    "Đã hủy",
  ];
  const themeColor = "#f97316";

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/orders/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử đơn hàng", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchMyOrders();
  }, [token]);

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

  const filteredOrders =
    filterStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.Status === filterStatus);

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: "70vh" }}>
      <h3 className="fw-bold mb-4" style={{ color: themeColor }}>
        📦 Lịch sử mua hàng
      </h3>

      {!isLoading && orders.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {statuses.map((status) => (
            <button
              key={status}
              className={`btn rounded-pill px-4 fw-bold ${filterStatus === status ? "text-white" : "btn-outline-secondary"}`}
              style={{
                backgroundColor:
                  filterStatus === status ? themeColor : "transparent",
                borderColor: filterStatus === status ? themeColor : "#dee2e6",
                transition: "all 0.3s ease",
              }}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0 table-responsive">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted mb-3">Bạn chưa có đơn hàng nào.</h5>
              <Link
                to="/"
                className="btn text-white fw-bold"
                style={{ backgroundColor: themeColor }}
              >
                Mua sắm ngay
              </Link>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">
                Không có đơn hàng nào ở trạng thái "{filterStatus}".
              </h5>
            </div>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.OrderID}>
                    <td className="px-4">
                      <strong>#{o.OrderID}</strong>
                    </td>
                    <td>{new Date(o.OrderDate).toLocaleDateString("vi-VN")}</td>
                    <td className="text-danger fw-bold">
                      {Math.round(o.TotalAmount).toLocaleString("vi-VN")} đ
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(o.Status)} px-3 py-2`}
                      >
                        {o.Status}
                      </span>
                    </td>
                    <td>
                      {/* SỬA NÚT BẤM CŨ THÀNH LINK MỚI */}
                      <Link
                        to={`/orders/${o.OrderID}`}
                        className="btn btn-sm btn-outline-info fw-bold"
                      >
                        👁️ Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- XÓA SẠCH ĐOẠN HTML CỦA MODAL CŨ Ở ĐÂY --- */}
    </div>
  );
};

export default OrderHistory;
