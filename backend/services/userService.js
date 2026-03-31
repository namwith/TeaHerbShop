// backend/services/userService.js
const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

// 1. Lấy thông tin User
const getUserProfile = async (userId) => {
  const [rows] = await pool.query(
    "SELECT UserID, Username, Role, FullName, Phone, Address, Avatar, Status, CreatedAt FROM Users WHERE UserID = ?",
    [userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

// 2. Cập nhật thông tin User
const updateUserProfile = async (userId, data) => {
  const { FullName, Phone, Address } = data;
  await pool.query(
    "UPDATE Users SET FullName = ?, Phone = ?, Address = ? WHERE UserID = ?",
    [FullName || "", Phone || "", Address || "", userId]
  );
  return true;
};

// 3. Đổi mật khẩu
const changeUserPassword = async (userId, oldPassword, newPassword) => {
  // Lấy user từ DB để lấy mật khẩu cũ đã mã hóa
  const [users] = await pool.query("SELECT Password FROM Users WHERE UserID = ?", [userId]);
  if (users.length === 0) throw new Error("Không tìm thấy người dùng!");

  const user = users[0];

  // So sánh mật khẩu cũ
  const validPassword = await bcrypt.compare(oldPassword, user.Password);
  if (!validPassword) {
    if (oldPassword !== user.Password) { // Dành cho DB cũ chưa mã hóa bcrypt
        throw new Error("Mật khẩu cũ không chính xác!");
    }
  }

  // Mã hóa mật khẩu mới và lưu DB
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  await pool.query("UPDATE Users SET Password = ? WHERE UserID = ?", [hashedNewPassword, userId]);
  return true;
};

// ... (giữ nguyên các hàm cũ)
const getAllUsers = async (req, res) => {
  try {
    const data = await userService.getAllAdminUsers();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy user" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    await userService.updateUserStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: "Cập nhật user thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "Đã xóa tài khoản!" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({ success: false, message: 'Khách này đã có đơn hàng, vui lòng dùng chức năng Khóa!' });
    }
    res.status(500).json({ success: false, message: "Lỗi server khi xóa." });
  }
};

// Export tất cả hàm để Controller gọi
module.exports = { getUserProfile, updateUserProfile, changeUserPassword, getAllUsers, updateUserStatus, deleteUser };