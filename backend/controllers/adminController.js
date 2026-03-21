const { sql } = require("../config/db");

// Lấy danh sách tất cả đơn hàng (Kèm tên người mua)
const getAllOrders = async (req, res) => {
  try {
    const pool = await sql.connect();

    // Dùng LEFT JOIN để lấy được cả đơn của user đã đăng nhập lẫn khách vãng lai
    const result = await pool.request().query(`
            SELECT 
                o.OrderID, 
                o.TotalAmount, 
                o.OrderDate, 
                o.Status, 
                ISNULL(u.Username, N'Khách vãng lai') AS Username
            FROM Orders o
            LEFT JOIN Users u ON o.UserID = u.UserID
            ORDER BY o.OrderDate DESC
        `);

    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Cập nhật trạng thái đơn hàng (Duyệt đơn)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pool = await sql.connect();
    await pool
      .request()
      .input("Status", sql.NVarChar, status)
      .input("OrderID", sql.Int, id).query(`
                UPDATE Orders 
                SET Status = @Status 
                WHERE OrderID = @OrderID
            `);

    res.status(200).json({
      success: true,
      message: `Đã cập nhật đơn hàng #${id} thành: ${status}`,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật đơn hàng:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật" });
  }
};

module.exports = { getAllOrders, updateOrderStatus };
