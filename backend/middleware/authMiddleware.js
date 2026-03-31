const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Lấy token từ header của request (Chuẩn: "Bearer <token>")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Nếu không có token -> Báo lỗi 401 Unauthorized (Chưa xác thực)
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập để thực hiện chức năng này!",
    });
  }

  try {
    // 3. Giải mã token bằng Secret Key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Gắn thông tin user vừa giải mã vào request để các Controller sau có thể dùng
    req.user = decoded;

    // 5. Cho phép đi tiếp vào Controller (Mở cửa cho qua)
    next();
  } catch (error) {
    // Token sai, bị sửa đổi, hoặc hết hạn -> Báo lỗi 403 Forbidden
    return res.status(403).json({
      success: false,
      message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!",
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Quyền truy cập bị từ chối! Chức năng này chỉ dành cho Admin.",
    });
  }
};

const checkBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Không có token!" });

  const [rows] = await pool.query(
    "SELECT * FROM TokenBlacklist WHERE token = ?",
    [token],
  );

  if (rows.length > 0) {
    return res.status(401).json({ message: "Token đã bị thu hồi (logout)!" });
  }

  next();
};

module.exports = { verifyToken, verifyAdmin, checkBlacklist };
