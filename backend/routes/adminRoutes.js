const express = require("express");
const router = express.Router();

// Middleware
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ==========================================
// CÁC CONTROLLERS ĐÃ ĐƯỢC TÁCH RIÊNG BIỆT
// ==========================================

// 1. Thống kê
const {
  getDashboardStats,
  getChartData,
} = require("../controllers/adminController");

// 2. Quản lý Sản phẩm (Đã gom chung Nhập kho và Trạng thái về đây)
const {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus,
} = require("../controllers/productAdminController");

// 3. Quản lý Đơn hàng
const {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} = require("../controllers/orderController");

// 4. Quản lý Khách hàng
const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");

// ==========================================
// 🔴 PHÂN HỆ ADMIN (Tiền tố /api/admin)
// ==========================================

// 3.1 Thống kê (Dashboard)
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
router.get("/chart-stats", verifyAdmin, getChartData);

// 3.2 Quản lý Sản phẩm
router.get("/products", verifyToken, verifyAdmin, getAdminProducts);
router.post(
  "/products",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  createProduct,
);
router.put(
  "/products/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  updateProduct,
);
router.delete("/products/:id", verifyToken, verifyAdmin, deleteProduct);
router.put("/products/:id/stock", verifyAdmin, updateProductStock);
router.put("/products/:id/status", verifyAdmin, toggleProductStatus);

// 3.3 Quản lý Đơn hàng
router.get("/orders", verifyToken, verifyAdmin, getAllOrders);
router.get("/orders/:id", verifyToken, verifyAdmin, getOrderDetails);
router.put("/orders/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

// 3.4 Quản lý User
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/users/:id/status", verifyToken, verifyAdmin, updateUserStatus);
router.delete("/users/:id", verifyAdmin, deleteUser);

module.exports = router;
