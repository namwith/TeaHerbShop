const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// 1. ĐĂNG KÝ
const register = async (req, res) => {
  try {
    const { username, password, fullName, phone, address } = req.body;

    const [existingUsers] = await pool.query(
      "SELECT * FROM Users WHERE Username = ?",
      [username],
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tên đăng nhập đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO Users (Username, Password, Role, FullName, Phone, Address) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashedPassword,
        "user",
        fullName || null,
        phone || null,
        address || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "🎉 Đăng ký thành công! Hãy đăng nhập.",
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// 2. ĐĂNG NHẬP
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await pool.query("SELECT * FROM Users WHERE Username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại!" });
    }

    const user = users[0];

    if (user.Status === "banned") {
      return res
        .status(403)
        .json({ success: false, message: "Tài khoản của bạn đã bị khóa!" });
    }

    const validPassword = await bcrypt.compare(password, user.Password);
    if (!validPassword) {
      if (password !== user.Password) {
        return res
          .status(400)
          .json({ success: false, message: "Sai mật khẩu!" });
      }
    }

    const token = jwt.sign(
      { id: user.UserID, username: user.Username, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: { username: user.Username, role: user.Role },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

module.exports = { register, login };
