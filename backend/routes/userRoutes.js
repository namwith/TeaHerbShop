const express = require("express");
const router = express.Router();

// Middleware
const { verifyToken } = require("../middleware/authMiddleware");

// Controllers
const { register, login } = require("../controllers/authController");
const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

// NHỚ IMPORT THÊM changePassword VÀO ĐÂY:
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

const {
  createOrder,
  getMyOrders,
  getMyOrderDetails,
} = require("../controllers/orderController");

// ==========================================
// 🟢 1. PHÂN HỆ PUBLIC
// ==========================================
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/products", getProducts);

// ==========================================
// 🔵 2. PHÂN HỆ USER
// ==========================================
router.get("/users/profile", verifyToken, getProfile);
router.put("/users/profile", verifyToken, updateProfile);

// 👉 ROUTE ĐỔI MẬT KHẨU MỚI THÊM:
router.put("/users/change-password", verifyToken, changePassword);

// Đặt hàng & Lịch sử
router.post("/orders", verifyToken, createOrder);
router.get("/orders/me", verifyToken, getMyOrders);
router.get("/orders/me/:id", verifyToken, getMyOrderDetails);

module.exports = router;
