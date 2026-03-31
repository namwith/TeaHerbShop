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
      await pool.query(
        `INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)`,
        [orderId, productId, item.quantity, item.Price],
      );
      // Trừ kho
      await productService.decreaseStock(productId, item.quantity);
    }
    return orderId;
  },

  getMyOrders: async (userId) => {
    const [rows] = await pool.query(
      "SELECT * FROM Orders WHERE UserID = ? ORDER BY OrderDate DESC",
      [userId],
    );
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
