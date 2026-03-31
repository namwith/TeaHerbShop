const productService = require("../services/productService");

// LẤY DANH SÁCH SẢN PHẨM (DÀNH CHO KHÁCH HÀNG)
const getProducts = async (req, res) => {
  try {
    // Khách hàng gọi API này sẽ tự động bị lọc mất các sản phẩm Stock <= 0
    const products = await productService.getAllProducts(false);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Lỗi Controller - getProducts:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy sản phẩm!" });
  }
};

// LẤY DANH SÁCH TẤT CẢ (DÀNH CHO ADMIN QUẢN LÝ KHO)
const getAdminProducts = async (req, res) => {
  try {
    // Truyền true để lấy full cả hàng hết (để admin còn biết đường nhập thêm)
    const products = await productService.getAllProducts(true);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Lỗi Controller - getAdminProducts:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// LẤY CHI TIẾT SẢN PHẨM
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Lỗi Controller - getProductById:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// ĐÁNH GIÁ SẢN PHẨM
const submitReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user.id; // Lấy từ middleware verifyToken

    if (!productId || !orderId || !rating) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin đánh giá!" });
    }

    await productService.submitReview(userId, productId, orderId, rating, comment);
    
    res.status(200).json({ success: true, message: "Cảm ơn bạn đã đánh giá sản phẩm!" });
  } catch (error) {
    console.error("Lỗi Controller - submitReview:", error);
    res.status(500).json({ success: false, message: "Lỗi lưu đánh giá!" });
  }
};

module.exports = { getProducts, getAdminProducts, getProductById, submitReview };
