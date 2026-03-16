const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Lấy token từ header của request (Chuẩn: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Nếu không có token -> Báo lỗi 401 Unauthorized (Chưa xác thực)
    if (!token) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thực hiện chức năng này!' });
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
        return res.status(403).json({ success: false, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn!' });
    }
};

module.exports = { verifyToken };