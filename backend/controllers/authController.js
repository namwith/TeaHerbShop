// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { username, password, fullName, phone, address } = req.body;

    // Gọi Service
    await authService.registerUser(
      username,
      password,
      fullName,
      phone,
      address,
    );

    res
      .status(201)
      .json({
        success: true,
        message: "🎉 Đăng ký thành công! Hãy đăng nhập.",
      });
  } catch (error) {
    // SỬ DỤNG .includes() ĐỂ BẮT LỖI CHÍNH XÁC VÀ AN TOÀN HƠN
    if (error.message && error.message.includes("Tên đăng nhập đã tồn tại")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Gọi Service
    const user = await authService.loginUser(username, password);

    // Ký JWT
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
    // SỬ DỤNG .includes() ĐỂ BẮT LỖI ĐĂNG NHẬP
    if (
      error.message &&
      (error.message.includes("Tài khoản không tồn tại") ||
        error.message.includes("Sai mật khẩu") ||
        error.message.includes("bị khóa"))
    ) {
      // Mã 403 cho tài khoản bị khóa, 400 cho các lỗi còn lại
      const statusCode = error.message.includes("khóa") ? 403 : 400;
      return res
        .status(statusCode)
        .json({ success: false, message: error.message });
    }

    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

const logout = async (req, res) => {
  // Vì JWT được quản lý trên frontend (localStorage), 
  // API logout thực chất chỉ trả về phản hồi thành công.
  // Frontend sẽ tự xóa token để hoàn tất quá trình.
  try {
    res.status(200).json({ success: true, message: "Đăng xuất thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

module.exports = { register, login, logout };
