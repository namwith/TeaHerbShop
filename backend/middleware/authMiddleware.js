const jwt = require("jsonwebtoken");

// 1. Kiểm tra xem người dùng có Token hợp lệ không
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn!",
        });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa xác thực (Không tìm thấy Token)!",
    });
  }
};

// 2. Kiểm tra xem người dùng có phải là Admin không
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // Lấy quyền của user
    const userRole = req.user.role || req.user.Role || "";

    // Thêm .trim() để dọn sạch khoảng trắng thừa (nếu có) trong MySQL
    if (userRole.trim().toLowerCase() === "admin") {
      next();
    } else {
      // In ra Terminal xem rốt cuộc nó đang hiểu quyền là gì
      console.log("❌ LỖI QUYỀN: Token đang chứa quyền là ->", `"${userRole}"`);
      res.status(403).json({
        success: false,
        message: "Quyền truy cập bị từ chối! Chức năng này chỉ dành cho Admin.",
      });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
