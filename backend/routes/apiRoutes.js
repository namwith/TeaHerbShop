const express = require('express');
const router = express.Router();

const { getProducts } = require('../controllers/productController');
const { simulateCombo } = require('../controllers/comboController');
const { createOrder } = require('../controllers/orderController');
const { register, login } = require('../controllers/authController');

// 1. IMPORT MIDDLEWARE VÀO ĐÂY
const { verifyToken } = require('../middleware/authMiddleware');

// Các API không cần bảo vệ (Ai cũng xem được)
router.get('/products', getProducts);
router.post('/combo/simulate', simulateCombo);
router.post('/auth/register', register);
router.post('/auth/login', login);

// 2. GẮN MIDDLEWARE BẢO VỆ VÀO API ĐẶT HÀNG
// Khi gọi '/orders', nó sẽ chạy verifyToken trước. Nếu OK, hàm next() trong verifyToken mới cho phép chạy tiếp vào createOrder
router.post('/orders', verifyToken, createOrder); 

module.exports = router;