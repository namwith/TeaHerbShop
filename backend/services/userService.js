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

module.exports = { getUserProfile, updateUserProfile, changeUserPassword };