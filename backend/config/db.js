const mysql = require("mysql2/promise");
require("dotenv").config();

// Tạo một "Hồ chứa" (Pool) kết nối để tối ưu hiệu suất
// Pool giúp tái sử dụng các kết nối thay vì tạo mới liên tục
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    // Thử lấy ra 1 kết nối để kiểm tra xem cấu hình đúng chưa
    const connection = await pool.getConnection();
    console.log("✅ Đã kết nối thành công đến MySQL Database!");
    connection.release(); // Test xong thì trả lại vào hồ chứa
  } catch (error) {
    console.error("❌ Lỗi kết nối MySQL:", error.message);
    console.error("Hãy kiểm tra lại tài khoản/mật khẩu trong file .env nhé!");
    process.exit(1);
  }
};

// Xuất ra pool để các Controller dùng để truy vấn
module.exports = { pool, connectDB };
