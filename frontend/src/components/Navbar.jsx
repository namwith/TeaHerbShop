import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import AuthModal from "./AuthModal";
import CartModal from "./CartModal";

const Navbar = () => {
  // Gọi 'não bộ' để lấy thông tin user hiện tại và hàm đăng xuất
  const { user, logout } = useContext(AuthContext);
  const { cartCount, clearCart } = useContext(CartContext);

  // 2. Viết hàm gộp: Vừa đăng xuất, vừa xóa giỏ hàng
  const handleLogout = () => {
    logout();
    clearCart();
  };

  return (
    /* THÊM THẺ <> Ở ĐÂY ĐỂ BỌC TOÀN BỘ JSX */
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top mb-4">
        <div className="container">
          {/* Dùng <Link> của React Router thay cho thẻ <a> để chuyển trang không bị reload */}
          <Link className="navbar-brand fw-bold text-success" to="/">
            🌿 TeaHerbShop
          </Link>

          <div className="d-flex align-items-center gap-3">
            {/* 1. Nếu là Admin -> Hiện nút Quản trị */}
            {user && user.role === "admin" && (
              <Link to="/admin" className="btn btn-warning btn-sm fw-bold">
                ⚙️ Quản trị
              </Link>
            )}

            {/* 2. Kiểm tra trạng thái đăng nhập */}
            {/* 3. SỬA NÚT ĐĂNG XUẤT THÀNH onClick={handleLogout} */}
            {user ? (
              <div className="d-flex align-items-center">
                <span className="text-secondary me-3">
                  Chào, <strong>{user.username}</strong>!
                </span>

                {/* Nút Lịch sử mua hàng */}
                <Link
                  to="/orders"
                  className="btn btn-sm btn-outline-success me-2 fw-bold"
                >
                  📦 Đơn hàng
                </Link>
                {/* Nút Hồ sơ */}
                <Link
                  to="/profile"
                  className="btn btn-sm text-white me-2 fw-bold"
                  style={{ backgroundColor: "#f97316" }}
                >
                  👤 Hồ sơ
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              // CHƯA ĐĂNG NHẬP: Hiện nút Đăng nhập và gọi Bootstrap Modal
              <button
                className="btn btn-outline-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#authModal"
              >
                Đăng nhập
              </button>
            )}

            {/* BẬT DATA-BS ĐỂ MỞ MODAL VÀ HIỂN THỊ SỐ LƯỢNG THẬT */}
            <button
              className="btn btn-outline-success btn-sm position-relative"
              data-bs-toggle="modal"
              data-bs-target="#cartModal"
            >
              🛒 Giỏ hàng
              {cartCount > 0 ? (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              ) : (
                <span className="fw-bold ms-1">(0)</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Modal Đăng nhập/Đăng ký (Dùng Bootstrap Modal) */}
      <AuthModal />
      <CartModal />
    </>
  );
};

// Xuất component để sử dụng ở App.js
export default Navbar;
