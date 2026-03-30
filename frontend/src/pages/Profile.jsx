import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// Nhớ import toast
import { toast } from "react-toastify";

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const themeColor = "#f97316"; // Màu cam chủ đạo

  // --- STATE HỒ SƠ ---
  const [profile, setProfile] = useState({
    FullName: "",
    Phone: "",
    Address: "",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // --- STATE MẬT KHẨU ---
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 1. Tự động lấy dữ liệu khi vừa vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const data = res.data.data;
          setProfile({
            FullName: data.FullName || "",
            Phone: data.Phone || "",
            Address: data.Address || "",
          });
        }
      } catch (error) {
        console.error("Lỗi tải hồ sơ:", error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // 2. Xử lý lưu thông tin Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/profile",
        profile,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success("🎉 Cập nhật hồ sơ thành công!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu thông tin!");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // 3. Xử lý Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Ràng buộc sơ bộ ở Frontend
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.warning("Mật khẩu xác nhận không khớp!");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.warning("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }

    setIsChangingPassword(true);
    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("🔑 Đổi mật khẩu thành công!");
        // Làm rỗng form sau khi đổi thành công
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu!");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "600px" }}>
      {/* CARD 1: THÔNG TIN CÁ NHÂN */}
      <div
        className="card shadow-sm border-0 mb-4"
        style={{ borderRadius: "15px", overflow: "hidden" }}
      >
        <div
          className="card-header text-white text-center py-4"
          style={{ backgroundColor: themeColor }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-2 shadow-sm"
            style={{ width: "80px", height: "80px", fontSize: "35px" }}
          >
            🧑‍💻
          </div>
          <h4 className="fw-bold mb-0">Hồ sơ cá nhân</h4>
          <p className="mb-0 opacity-75">Tài khoản: {user?.username}</p>
        </div>

        <div className="card-body p-4 bg-light">
          <form onSubmit={handleSaveProfile}>
            <div className="mb-3">
              <label className="form-label fw-bold text-secondary">
                Họ và Tên
              </label>
              <input
                type="text"
                className="form-control p-2"
                placeholder="Nhập họ tên đầy đủ..."
                value={profile.FullName}
                onChange={(e) =>
                  setProfile({ ...profile, FullName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold text-secondary">
                Số điện thoại
              </label>
              <input
                type="tel"
                className="form-control p-2"
                placeholder="Ví dụ: 0987654321"
                value={profile.Phone}
                onChange={(e) =>
                  setProfile({ ...profile, Phone: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-secondary">
                Địa chỉ giao hàng mặc định
              </label>
              <textarea
                className="form-control p-2"
                rows="3"
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                value={profile.Address}
                onChange={(e) =>
                  setProfile({ ...profile, Address: e.target.value })
                }
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn text-white w-100 fw-bold py-2 shadow-sm"
              style={{ backgroundColor: themeColor, fontSize: "1.1rem" }}
              disabled={isLoadingProfile}
            >
              {isLoadingProfile ? "Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>

      {/* CARD 2: ĐỔI MẬT KHẨU */}
      <div
        className="card shadow-sm border-0"
        style={{ borderRadius: "15px", overflow: "hidden" }}
      >
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
          <h5 className="fw-bold text-dark mb-0">🔒 Đổi mật khẩu</h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label fw-bold text-secondary small">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="form-control p-2 bg-light"
                required
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-secondary small">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  className="form-control p-2 bg-light"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label fw-bold text-secondary small">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  className="form-control p-2 bg-light"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 fw-bold py-2 shadow-sm"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
