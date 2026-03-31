import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
// 1. IMPORT API INSTANCE (Dùng ../../ vì file này nằm trong thư mục con admin)
import api from "../../api/axios.js";
import { AuthContext } from "../../context/AuthContext";

const OrderDetails = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL (vd: /admin/orders/5 -> id = 5)
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const themeColor = "#f97316";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 2. GỌI API SIÊU NGẮN (Đã bỏ localhost và headers thủ công)
        const res = await api.get(`/admin/orders/${id}`);
        if (res.data.success) setOrder(res.data.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
      }
    };
    if (token) fetchDetails();
  }, [id, token]);

  if (!order)
    return (
      <div className="text-center mt-5 text-muted py-5">
        <div className="spinner-border text-warning mb-3" role="status"></div>
        <div>Đang tải thông tin đơn hàng...</div>
      </div>
    );

  return (
    <div className="container mt-4 mb-5">
      {/* Nút quay lại */}
      <Link to="/admin" className="btn btn-outline-secondary mb-4 fw-bold">
        <i className="bi bi-arrow-left"></i> Quay lại Bảng điều khiển
      </Link>

      <h3 className="fw-bold mb-4" style={{ color: themeColor }}>
        📦 Chi tiết Đơn hàng #{order.OrderID}
      </h3>

      <div className="row g-4">
        {/* CỘT TRÁI: THÔNG TIN KHÁCH & ĐƠN */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">👤 Thông tin khách hàng</h6>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <strong>Tài khoản:</strong> {order.Username}
              </p>
              <p className="mb-2">
                <strong>Họ tên:</strong>{" "}
                {order.FullName || (
                  <span className="text-muted">Chưa cập nhật</span>
                )}
              </p>
              <p className="mb-0">
                <strong>SĐT:</strong>{" "}
                {order.UserPhone || (
                  <span className="text-muted">Chưa cập nhật</span>
                )}
              </p>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">📝 Thông tin giao hàng</h6>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <strong>Người nhận:</strong>{" "}
                {order.ReceiverPhone || order.UserPhone || "-"}
              </p>
              <p className="mb-2">
                <strong>Địa chỉ:</strong>{" "}
                {order.ShippingAddress || (
                  <span className="text-muted">Giao tại quầy</span>
                )}
              </p>
              <p className="mb-2">
                <strong>Thanh toán:</strong>{" "}
                <span className="badge bg-info text-dark">
                  {order.PaymentMethod}
                </span>
              </p>
              <p className="mb-0">
                <strong>Trạng thái:</strong>{" "}
                <span className="badge bg-warning text-dark">
                  {order.Status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH MÓN HÀNG */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">🛒 Danh sách sản phẩm</h6>
            </div>
            <div className="card-body table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items &&
                    order.items.map((item) => (
                      <tr key={item.ProductID}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.ImageURL ? (
                              <img
                                src={`http://localhost:3000${item.ImageURL}`}
                                alt={item.Name}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "5px",
                                  marginRight: "10px",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#eee",
                                  borderRadius: "5px",
                                  marginRight: "10px",
                                }}
                              ></div>
                            )}
                            <strong>{item.Name}</strong>
                          </div>
                        </td>
                        <td>{item.Price.toLocaleString("vi-VN")} đ</td>
                        <td className="fw-bold">x {item.Quantity}</td>
                        <td className="text-danger fw-bold">
                          {(item.Price * item.Quantity).toLocaleString("vi-VN")}{" "}
                          đ
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-light text-end py-3">
              <h5 className="mb-0">
                Tổng cộng:{" "}
                <span className="text-danger fw-bold ms-2 fs-4">
                  {order.TotalAmount.toLocaleString("vi-VN")} đ
                </span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
