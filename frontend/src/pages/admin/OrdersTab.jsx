import React from "react";
import { Link } from "react-router-dom";

const OrdersTab = ({ orders, themeColor, updateOrderStatus }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold" style={{ color: themeColor }}>
          📦 Quản lý Đơn hàng
        </h5>
      </div>
      <div className="card-body table-responsive">
        <table className="table table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Mã Đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* THÊM KIỂM TRA NẾU CÓ ĐƠN HÀNG THÌ MỚI HIỂN THỊ */}
            {orders && orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.OrderID}>
                  <td>
                    <strong>#{o.OrderID}</strong>
                  </td>
                  <td>{o.Username}</td>
                  <td>{new Date(o.OrderDate).toLocaleDateString("vi-VN")}</td>
                  <td className="text-danger fw-bold">
                    {Math.round(o.TotalAmount).toLocaleString("vi-VN")} đ
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        o.Status === "Đã giao"
                          ? "bg-success"
                          : o.Status === "Đã hủy"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                      }`}
                    >
                      {o.Status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${o.OrderID}`}
                      className="btn btn-sm btn-info text-white me-2 fw-bold"
                    >
                      👁️ Xem
                    </Link>
                    {o.Status === "Chờ xác nhận" && (
                      <button
                        className="btn btn-sm text-white me-2 fw-bold"
                        style={{ backgroundColor: themeColor }}
                        onClick={() =>
                          updateOrderStatus(o.OrderID, "Đang xử lý")
                        }
                      >
                        Duyệt
                      </button>
                    )}
                    {o.Status === "Đang xử lý" && (
                      <button
                        className="btn btn-sm btn-success me-2 fw-bold"
                        onClick={() => updateOrderStatus(o.OrderID, "Đã giao")}
                      >
                        Xong
                      </button>
                    )}
                    {o.Status !== "Đã giao" && o.Status !== "Đã hủy" && (
                      <button
                        className="btn btn-sm btn-outline-danger fw-bold"
                        onClick={() => updateOrderStatus(o.OrderID, "Đã hủy")}
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              /* TRẠNG THÁI RỖNG KHI CHƯA CÓ ĐƠN HÀNG */
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  <h5 className="mb-3">🛒 Chưa có đơn hàng nào!</h5>
                  <p>Khi khách hàng đặt mua, đơn hàng sẽ xuất hiện tại đây.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;
