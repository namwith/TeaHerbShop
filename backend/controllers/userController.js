// backend/controllers/userController.js
const userService = require("../services/userService");

// 1. LẤY HỒ SƠ
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID từ thẻ Token do Middleware cung cấp

    // Gọi "Đầu bếp" làm việc
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

    // Gọi "Đầu bếp" làm việc
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

// 3. ĐỔI MẬT KHẨU (Đã được bổ sung vào đây)
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Gọi "Đầu bếp" xử lý logic cực nhọc
    await userService.changeUserPassword(userId, oldPassword, newPassword);

    res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("❌ Lỗi Controller - Đổi mật khẩu:", error.message);
    // Nếu lỗi là do sai pass (đã throw ở Service), trả về mã 400
    if (error.message === "Mật khẩu cũ không chính xác!") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi đổi mật khẩu" });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
