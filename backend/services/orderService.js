const { pool } = require("../config/db");
const productService = require("./productService");

const orderService = {
  // === CÁC HÀM DÀNH CHO KHÁCH HÀNG ===
  createOrder: async (
    userId,
    cartItems,
    totalAmount,
    shippingAddress,
    receiverPhone,
    paymentMethod,
  ) => {
    const [orderResult] = await pool.query(
      `INSERT INTO Orders (UserID, TotalAmount, Status, ShippingAddress, ReceiverPhone, PaymentMethod) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        totalAmount,
        "Chờ xác nhận",
        shippingAddress || "",
        receiverPhone || "",
        paymentMethod || "COD",
      ],
    );

    const orderId = orderResult.insertId;

    for (let item of cartItems) {
      const productId = item.ProductID || item.id;
      const itemPrice = item.price || item.Price;
      const itemQuantity = item.quantity || item.Quantity || 1;
      await pool.query(
        `INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)`,
        [orderId, productId, itemQuantity, itemPrice],
      );
      // Trừ kho
      await productService.decreaseStock(productId, itemQuantity);
    }
    return orderId;
  },

  getMyOrders: async (userId) => {
    const [rows] = await pool.query(
      "SELECT * FROM Orders WHERE UserID = ? ORDER BY OrderDate DESC",
      [userId],
    );

    // Lấy thêm items cho từng đơn hàng
    for (let order of rows) {
      const [items] = await pool.query(
        `SELECT od.*, p.Name, p.ImageURL 
         FROM OrderDetails od 
         JOIN Products p ON od.ProductID = p.ProductID 
         WHERE od.OrderID = ?`,
        [order.OrderID],
      );
      order.items = items;
    }

    return rows;
  },

  getMyOrderDetails: async (userId, orderId) => {
    const [orders] = await pool.query(
      `SELECT o.*, u.Username, u.FullName AS UserFullName, u.Phone AS UserPhone FROM Orders o LEFT JOIN Users u ON o.UserID = u.UserID WHERE o.OrderID = ? AND o.UserID = ?`,
      [orderId, userId],
    );
    if (orders.length === 0) return null;

    const [items] = await pool.query(
      `SELECT od.*, p.Name, p.ImageURL FROM OrderDetails od JOIN Products p ON od.ProductID = p.ProductID WHERE od.OrderID = ?`,
      [orderId],
    );
    orders[0].items = items;
    return orders[0];
  },

  cancelOrder: async (userId, orderId) => {
    // Chỉ cho phép hủy khi trạng thái là "Chờ xác nhận"
    const [orders] = await pool.query(
      "SELECT Status FROM Orders WHERE OrderID = ? AND UserID = ?",
      [orderId, userId]
    );

    if (orders.length === 0) {
      throw new Error("Không tìm thấy đơn hàng!");
    }

    if (orders[0].Status !== "Chờ xác nhận") {
      throw new Error("Chỉ có thể hủy đơn hàng đang chờ xác nhận!");
    }

    // Lấy chi tiết đơn hàng để cộng lại Stock
    const [items] = await pool.query(
      "SELECT ProductID, Quantity FROM OrderDetails WHERE OrderID = ?",
      [orderId]
    );

    // Cập nhật trạng thái thành Đã hủy
    await pool.query(
      "UPDATE Orders SET Status = 'Đã hủy' WHERE OrderID = ? AND UserID = ?",
      [orderId, userId]
    );

    // Cộng lại Stock
    for (let item of items) {
      await pool.query(
        "UPDATE Products SET Stock = Stock + ? WHERE ProductID = ?",
        [item.Quantity, item.ProductID]
      );
    }

    return true;
  },

  // === CÁC HÀM DÀNH CHO ADMIN ===
  getAllAdminOrders: async () => {
    const [rows] = await pool.query(
      `SELECT o.*, u.Username FROM Orders o LEFT JOIN Users u ON o.UserID = u.UserID ORDER BY o.OrderDate DESC`,
    );
    return rows;
  },

  getAdminOrderDetails: async (id) => {
    const [orders] = await pool.query(
      `SELECT o.*, u.Username, u.FullName AS UserFullName, u.Phone AS UserPhone FROM Orders o LEFT JOIN Users u ON o.UserID = u.UserID WHERE o.OrderID = ?`,
      [id],
    );
    if (orders.length === 0) return null;

    const [items] = await pool.query(
      `SELECT od.*, p.Name, p.ImageURL FROM OrderDetails od JOIN Products p ON od.ProductID = p.ProductID WHERE od.OrderID = ?`,
      [id],
    );
    orders[0].items = items;
    return orders[0];
  },

  updateOrderStatus: async (id, status) => {
    await pool.query("UPDATE Orders SET Status = ? WHERE OrderID = ?", [
      status,
      id,
    ]);
    return true;
  },
};

module.exports = orderService;
