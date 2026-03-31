const express = require('express');
const router = express.Router();
const { getChartData } = require('../controllers/adminController');
// Middleware
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Controllers
const { getAdminProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productAdminController');
const { 
    getDashboardStats, 
    getAllOrders, 
    getOrderDetails, 
    updateOrderStatus, 
    getAllUsers, 
    updateUserStatus, 
    deleteUser
} = require('../controllers/adminController');

// ==========================================
// 🔴 3. PHÂN HỆ ADMIN (Tự động được gắn tiền tố /api/admin)
// ==========================================

// 3.1 Thống kê (Dashboard) -> Trở thành: /api/admin/dashboard
router.get('/dashboard', verifyToken, verifyAdmin, getDashboardStats);
router.get('/chart-stats', verifyAdmin, getChartData);

// 3.2 Quản lý Sản phẩm -> Trở thành: /api/admin/products
router.get('/products', verifyToken, verifyAdmin, getAdminProducts);
router.post('/products', verifyToken, verifyAdmin, upload.single('image'), createProduct);
router.put('/products/:id', verifyToken, verifyAdmin, upload.single('image'), updateProduct);
router.delete('/products/:id', verifyToken, verifyAdmin, deleteProduct);

// 3.3 Quản lý Đơn hàng -> Trở thành: /api/admin/orders
router.get('/orders', verifyToken, verifyAdmin, getAllOrders);
router.get('/orders/:id', verifyToken, verifyAdmin, getOrderDetails);
router.put('/orders/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

// 3.4 Quản lý User -> Trở thành: /api/admin/users
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.put('/users/:id/status', verifyToken, verifyAdmin, updateUserStatus);
router.delete('/users/:id', verifyAdmin, deleteUser);

module.exports = router;