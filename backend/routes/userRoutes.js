const express = require("express");
const router = express.Router();

// Middleware
const { verifyToken } = require("../middleware/authMiddleware");

// Controllers
const { register, login, logout } = require("../controllers/authController");
const {
  getProducts,
  getProductById,
  submitReview,
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
  cancelOrder,
} = require("../controllers/orderController");

// ==========================================
// 🟢 1. PHÂN HỆ PUBLIC
// ==========================================
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", verifyToken, logout);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// ==========================================
// 🔵 2. PHÂN HỆ USER
// ==========================================
router.get("/users/profile", verifyToken, getProfile);
router.put("/users/profile", verifyToken, updateProfile);

// 👉 ROUTE ĐỔI MẬT KHẨU MỚI THÊM:
router.put("/users/change-password", verifyToken, changePassword);

// Đặt hàng, đánh giá & Lịch sử
router.post("/orders", verifyToken, createOrder);
router.get("/orders/me", verifyToken, getMyOrders);
router.get("/orders/me/:id", verifyToken, getMyOrderDetails);
router.put("/orders/:id/cancel", verifyToken, cancelOrder);

// Đánh giá sản phẩm
router.post("/products/reviews", verifyToken, submitReview);

module.exports = router;
