const { pool } = require("../config/db");
const productService = require("../services/productService");

// 1. TẠO ĐƠN HÀNG MỚI
const createOrder = async (req, res) => {
  try {
    const {
      cartItems,
      totalAmount,
      shippingAddress,
      receiverPhone,
      paymentMethod,
    } = req.body;
    const userId = req.user.id;

    if (!cartItems || cartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Giỏ hàng của bạn đang trống!" });
    }

    const [orderResult] = await pool.query(
      `INSERT INTO Orders (UserID, TotalAmount, Status, ShippingAddress, ReceiverPhone, PaymentMethod) 
             VALUES (?, ?, ?, ?, ?, ?)`,
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

      // 1. Lưu vào Chi tiết đơn hàng
      await pool.query(
        `INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)`,
        [orderId, productId, item.quantity, item.Price],
      );

      // 2. TRỪ SỐ LƯỢNG TRONG KHO HÀNG
      await productService.decreaseStock(productId, item.quantity);
    }

    res.status(200).json({
      success: true,
      message: "🎉 Đặt hàng thành công!",
      orderId: orderId,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error.message);

    // Nếu lỗi là do Hết hàng (đã throw ở productService), báo luôn cho Front-end
    if (error.message.includes("không đủ số lượng")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi đặt hàng" });
  }
};

// 2. LẤY DANH SÁCH ĐƠN HÀNG CỦA TÔI
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM Orders WHERE UserID = ? ORDER BY OrderDate DESC",
      [userId],
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// 3. LẤY CHI TIẾT 1 ĐƠN HÀNG
const getMyOrderDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [orders] = await pool.query(
      `SELECT o.*, u.Username, u.FullName AS UserFullName, u.Phone AS UserPhone
             FROM Orders o LEFT JOIN Users u ON o.UserID = u.UserID
             WHERE o.OrderID = ? AND o.UserID = ?`,
      [id, userId],
    );

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

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
    console.error("Lỗi lấy chi tiết đơn:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// XUẤT ĐỦ 3 HÀM RA NGOÀI
module.exports = { createOrder, getMyOrders, getMyOrderDetails };
