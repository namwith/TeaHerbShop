// backend/controllers/orderController.js
const orderService = require("../services/orderService");

// === DÀNH CHO KHÁCH HÀNG ===
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

    const orderId = await orderService.createOrder(
      userId,
      cartItems,
      totalAmount,
      shippingAddress,
      receiverPhone,
      paymentMethod,
    );

    res
      .status(200)
      .json({ success: true, message: "🎉 Đặt hàng thành công!", orderId });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error.message);
    if (error.message.includes("không đủ số lượng")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi đặt hàng" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const data = await orderService.getMyOrders(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const getMyOrderDetails = async (req, res) => {
  try {
    const data = await orderService.getMyOrderDetails(
      req.user.id,
      req.params.id,
    );
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    await orderService.cancelOrder(userId, orderId);
    
    res.status(200).json({ success: true, message: "Đã hủy đơn hàng thành công!" });
  } catch (error) {
    if (error.message.includes("không tìm thấy") || error.message.includes("Chỉ có thể hủy")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("Lỗi hủy đơn:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi hủy đơn" });
  }
};

// === DÀNH CHO ADMIN ===
const getAllOrders = async (req, res) => {
  try {
    const data = await orderService.getAllAdminOrders();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy đơn hàng" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const data = await orderService.getAdminOrderDetails(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy chi tiết đơn" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    await orderService.updateOrderStatus(req.params.id, req.body.status);
    res
      .status(200)
      .json({ success: true, message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderDetails,
  cancelOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
};
