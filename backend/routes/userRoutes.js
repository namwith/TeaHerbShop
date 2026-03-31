const express = require("express");
const router = express.Router();

// Middleware
const { verifyToken, checkBlacklist } = require("../middleware/authMiddleware");

// Controllers
const { register, login, logout } = require("../controllers/authController");
const {
  getProducts,
  getProductById,
} = require("../controllers/productController");
const { getProfile, updateProfile } = require("../controllers/userController");
// IMPORT ĐỦ 3 HÀM TỪ ORDER CONTROLLER
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
router.post("/auth/logout", verifyToken, checkBlacklist, logout);

// ==========================================
// 🔵 2. PHÂN HỆ USER
// ==========================================
router.get("/users/profile", verifyToken, getProfile);
router.put("/users/profile", verifyToken, updateProfile);

// Đặt hàng & Lịch sử
router.post("/orders", verifyToken, createOrder);
router.get("/orders/me", verifyToken, getMyOrders);
// ROUTE CHI TIẾT ĐƠN HÀNG Ở ĐÂY:
router.get("/orders/me/:id", verifyToken, getMyOrderDetails);

module.exports = router;
