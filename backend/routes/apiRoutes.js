const express = require('express');
const router = express.Router();

// ==========================================
// --- 1. IMPORT CONTROLLERS (Não bộ xử lý) ---
// ==========================================
// Public & User
const { getProducts } = require('../controllers/productController');
const { simulateCombo } = require('../controllers/comboController');
const { createOrder } = require('../controllers/orderController');
const { register, login } = require('../controllers/authController');

// Admin - Đơn hàng
const { getAllOrders, updateOrderStatus } = require('../controllers/adminController');

// Admin - Sản phẩm (MỚI THÊM)
const { getAdminProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productAdminController');

// ==========================================
// --- 2. IMPORT MIDDLEWARE (Người gác cổng) ---
// ==========================================
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');


// ==========================================
// --- 3. KHAI BÁO ROUTES (Mở cổng API) ---
// ==========================================

// 🟢 NHÓM PUBLIC (Ai cũng truy cập được)
router.get('/products', getProducts);
router.post('/combo/simulate', simulateCombo);
router.post('/auth/register', register);
router.post('/auth/login', login);

// 🔵 NHÓM USER (Chỉ cần đi qua 1 cửa: verifyToken)
router.post('/orders', verifyToken, createOrder); 

// 🔴 NHÓM ADMIN (Phải đi qua 2 cửa: verifyToken -> verifyAdmin)
// Quản lý Đơn hàng
router.get('/admin/orders', verifyToken, verifyAdmin, getAllOrders);
router.put('/admin/orders/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

// Quản lý Sản phẩm (MỚI THÊM)
router.get('/admin/products', verifyToken, verifyAdmin, getAdminProducts);
router.post('/admin/products', verifyToken, verifyAdmin, createProduct);
router.put('/admin/products/:id', verifyToken, verifyAdmin, updateProduct);
router.delete('/admin/products/:id', verifyToken, verifyAdmin, deleteProduct);

module.exports = router;