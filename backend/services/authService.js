// backend/services/authService.js
const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

const authService = {
  registerUser: async (username, password, fullName, phone, address) => {
    // 1. Kiểm tra tồn tại
    const [existingUsers] = await pool.query(
      "SELECT * FROM Users WHERE Username = ?",
      [username],
    );
    if (existingUsers.length > 0) {
      throw new Error("Tên đăng nhập đã tồn tại!");
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Thêm vào DB
    const [result] = await pool.query(
      `INSERT INTO Users (Username, Password, Role, FullName, Phone, Address) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashedPassword,
        "user",
        fullName || null,
        phone || null,
        address || null,
      ],
    );
    return result.insertId;
  },

  loginUser: async (username, password) => {
    // 1. Tìm user
    const [users] = await pool.query("SELECT * FROM Users WHERE Username = ?", [
      username,
    ]);
    if (users.length === 0) {
      throw new Error("Tài khoản không tồn tại!");
    }

    const user = users[0];

    // 2. Kiểm tra trạng thái khóa
    if (user.Status === "banned") {
      throw new Error("Tài khoản của bạn đã bị khóa!");
    }

    // 3. Kiểm tra mật khẩu
    const validPassword = await bcrypt.compare(password, user.Password);
    if (!validPassword) {
      // Dự phòng trường hợp pass cũ chưa mã hóa lúc test
      if (password !== user.Password) throw new Error("Sai mật khẩu!");
    }

    return user;
  },
};

module.exports = authService;
