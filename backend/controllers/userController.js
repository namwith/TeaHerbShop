// backend/controllers/userController.js
const userService = require("../services/userService");

// ==========================================
// 🔵 PHẦN 1: CÁC HÀM DÀNH CHO KHÁCH HÀNG
// ==========================================

// 1. LẤY HỒ SƠ
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);

    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }
    res.status(200).json({ success: true, data: userProfile });
  } catch (error) {
    console.error("❌ Lỗi Controller - Lấy profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy hồ sơ" });
  }
};

// 2. CẬP NHẬT HỒ SƠ
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    await userService.updateUserProfile(userId, req.body);
    res
      .status(200)
      .json({ success: true, message: "Cập nhật hồ sơ thành công!" });
  } catch (error) {
    console.error("❌ Lỗi Controller - Cập nhật profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật hồ sơ" });
  }
};

// 3. ĐỔI MẬT KHẨU
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    await userService.changeUserPassword(userId, oldPassword, newPassword);
    res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("❌ Lỗi Controller - Đổi mật khẩu:", error.message);
    if (error.message === "Mật khẩu cũ không chính xác!") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi đổi mật khẩu" });
  }
};

// ==========================================
// 🔴 PHẦN 2: CÁC HÀM DÀNH CHO ADMIN
// ==========================================

// 4. LẤY DANH SÁCH TẤT CẢ KHÁCH HÀNG
const getAllUsers = async (req, res) => {
  try {
    const data = await userService.getAllAdminUsers();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    res.status(500).json({ success: false, message: "Lỗi lấy user" });
  }
};

// 5. KHÓA / MỞ KHÓA TÀI KHOẢN
const updateUserStatus = async (req, res) => {
  try {
    await userService.updateUserStatus(req.params.id, req.body.status);
    res
      .status(200)
      .json({ success: true, message: "Cập nhật user thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái user:", error);
    res.status(500).json({ success: false, message: "Lỗi cập nhật user" });
  }
};

// 6. XÓA TÀI KHOẢN
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "Đã xóa tài khoản!" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Khách này đã có đơn hàng, vui lòng dùng chức năng Khóa thay thế!",
        });
    }
    console.error("Lỗi xóa user:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xóa." });
  }
};

// Xuất khẩu đủ 6 hàm:
module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserStatus,
  deleteUser,
};
