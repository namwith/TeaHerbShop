const { pool } = require("../config/db");

// 1. THỐNG KÊ DASHBOARD
const getDashboardStats = async (req, res) => {
  try {
    const [[revenueResult]] = await pool.query(
      "SELECT SUM(TotalAmount) AS total FROM Orders WHERE Status = 'Đã giao'",
    );
    const [[ordersResult]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Orders",
    );
    const [[usersResult]] = await pool.query(
      "SELECT COUNT(*) AS total FROM Users WHERE Role = 'user'",
    );

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: revenueResult.total || 0,
        totalOrders: ordersResult.total || 0,
        totalUsers: usersResult.total || 0,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 2. QUẢN LÝ ĐƠN HÀNG
const getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT o.*, u.Username 
            FROM Orders o 
            LEFT JOIN Users u ON o.UserID = u.UserID 
            ORDER BY o.OrderDate DESC
        `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy đơn hàng" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      `
            SELECT o.*, u.Username, u.FullName AS UserFullName, u.Phone AS UserPhone 
            FROM Orders o LEFT JOIN Users u ON o.UserID = u.UserID 
            WHERE o.OrderID = ?
        `,
      [id],
    );

    if (orders.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });

    const [items] = await pool.query(
      `
            SELECT od.*, p.Name, p.ImageURL 
            FROM OrderDetails od 
            JOIN Products p ON od.ProductID = p.ProductID 
            WHERE od.OrderID = ?
        `,
      [id],
    );

    const orderData = orders[0];
    orderData.items = items;

    res.status(200).json({ success: true, data: orderData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy chi tiết đơn" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query("UPDATE Orders SET Status = ? WHERE OrderID = ?", [
      status,
      id,
    ]);
    res
      .status(200)
      .json({ success: true, message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật" });
  }
};

// 3. QUẢN LÝ USER
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT UserID, Username, FullName, Phone, Status, CreatedAt FROM Users WHERE Role = 'user' ORDER BY CreatedAt DESC",
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy user" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query("UPDATE Users SET Status = ? WHERE UserID = ?", [
      status,
      id,
    ]);
    res
      .status(200)
      .json({ success: true, message: "Cập nhật user thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật user" });
  }
};

// 4. THỐNG KÊ BIỂU ĐỒ (DÀNH CHO ADMIN)
const getChartData = async (req, res) => {
    try {
        const { filter } = req.query; // Nhận filter từ Frontend: '7days', '30days', '3months', 'year'
        
        // Tính toán mốc thời gian bắt đầu dựa trên filter
        let startDate = new Date();
        if (filter === '7days') startDate.setDate(startDate.getDate() - 7);
        else if (filter === '30days') startDate.setDate(startDate.getDate() - 30);
        else if (filter === '3months') startDate.setMonth(startDate.getMonth() - 3);
        else if (filter === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
        else startDate.setDate(startDate.getDate() - 7); // Mặc định là 7 ngày

        // Format ngày chuẩn MySQL (YYYY-MM-DD)
        const formattedDate = startDate.toISOString().split('T')[0];

        // Câu lệnh SQL: Lọc đơn hàng thành công, gom nhóm theo Ngày
        const query = `
            SELECT 
                DATE_FORMAT(OrderDate, '%d/%m') as date,
                COUNT(OrderID) as orders,
                SUM(TotalAmount) as revenue
            FROM Orders
            WHERE OrderDate >= ? AND Status != 'Đã hủy'
            GROUP BY DATE(OrderDate)
            ORDER BY DATE(OrderDate) ASC
        `;

        const [rows] = await pool.query(query, [formattedDate]);
        res.status(200).json({ success: true, data: rows });

    } catch (error) {
        console.error("Lỗi lấy dữ liệu biểu đồ:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 5. XÓA NGƯỜI DÙNG
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Thực hiện lệnh xóa
        await pool.query('DELETE FROM Users WHERE UserID = ?', [id]);

        res.status(200).json({ success: true, message: 'Đã xóa tài khoản người dùng thành công!' });
    } catch (error) {
        console.error("Lỗi xóa user:", error);
        // Trường hợp lỗi khóa ngoại (User đã có đơn hàng)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                success: false, 
                message: 'Không thể xóa khách hàng này vì họ đã có lịch sử mua hàng. Hãy sử dụng chức năng "Khóa" thay thế!' 
            });
        }
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa người dùng.' });
    }
};


module.exports = { 
    getDashboardStats, getAllOrders, getOrderDetails, 
    updateOrderStatus, getAllUsers, updateUserStatus, 
    getChartData, deleteUser
};
