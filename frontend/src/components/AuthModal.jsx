import React, { useState, useContext } from "react";
// 1. IMPORT API
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      // 2. GỌI API
      const res = await api.post(endpoint, { username, password });

      if (res.data.success) {
        toast.success(res.data.message);
        if (isLogin) {
          // Đăng nhập thành công -> Lưu vào Context
          login(res.data.token, res.data.user.username, res.data.user.role);
          document.getElementById("btnCloseAuthModal").click();
        } else {
          // Đăng ký thành công -> Chuyển sang form Đăng nhập
          setIsLogin(true);
          setUsername("");
          setPassword("");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi kết nối tới máy chủ!",
      );
    }
  };

  return (
    <div className="modal fade" id="authModal" tabIndex="-1">
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-success fs-4">
              {isLogin ? "👋 Đăng nhập" : "✨ Đăng ký"}
            </h5>
            <button
              type="button"
              className="btn-close"
              id="btnCloseAuthModal"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body pt-3 pb-4 px-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Tài khoản
                </label>
                <input
                  type="text"
                  className="form-control p-2 bg-light border-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="form-control p-2 bg-light border-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100 fw-bold py-2 rounded-pill shadow-sm"
              >
                {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ NGAY"}
              </button>
            </form>
            <div className="text-center mt-4 pt-3 border-top">
              <span
                className="text-success fw-bold"
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Chưa có tài khoản? Tạo mới ngay"
                  : "Đã có tài khoản? Đăng nhập"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
