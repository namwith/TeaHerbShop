const { pool } = require("../config/db");

const productService = {
  // 1. Lấy danh sách (Có phân biệt Admin và Khách)
  getAllProducts: async (isAdmin = false) => {
    // Admin thấy toàn bộ kho. Khách chỉ thấy hàng còn Tồn kho > 0 (Ẩn hàng hết)
    const query = isAdmin
      ? "SELECT * FROM Products ORDER BY ProductID DESC"
      : "SELECT * FROM Products WHERE Stock > 0 ORDER BY ProductID DESC";

    const [rows] = await pool.query(query);
    return rows;
  },

  // 2. Lấy chi tiết 1 sản phẩm kèm theo Đánh giá (Reviews)
  getProductById: async (id) => {
    // Lấy thông tin cơ bản của sản phẩm
    const [productRows] = await pool.query(
      "SELECT * FROM Products WHERE ProductID = ?",
      [id],
    );

    if (productRows.length === 0) return null;
    const product = productRows[0];

    // Lấy danh sách đánh giá của sản phẩm này
    const [reviews] = await pool.query(
      `SELECT r.ReviewID, r.Rating, r.Comment, r.CreatedAt, u.Username, u.FullName
       FROM Reviews r
       JOIN Users u ON r.UserID = u.UserID
       WHERE r.ProductID = ?
       ORDER BY r.CreatedAt DESC`,
      [id]
    );

    // Tính điểm trung bình và số lượt đánh giá
    product.reviews = reviews;
    product.reviewCount = reviews.length;
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, rv) => sum + rv.Rating, 0);
        product.rating = totalRating / reviews.length;
    } else {
        product.rating = 0;
    }

    return product;
  },

  // 3. Trừ kho khi khách đặt hàng thành công
  decreaseStock: async (productId, quantity) => {
    // Trừ đi số lượng, với điều kiện trong kho phải còn đủ hàng
    const [result] = await pool.query(
      "UPDATE Products SET Stock = Stock - ? WHERE ProductID = ? AND Stock >= ?",
      [quantity, productId, quantity],
    );

    if (result.affectedRows === 0) {
      throw new Error(`Sản phẩm ID ${productId} không đủ số lượng trong kho!`);
    }
    return true;
  },

  // 1. Cập nhật tồn kho (Admin)
    updateProductStock: async (id, stock) => {
        await pool.query("UPDATE Products SET Stock = ? WHERE ProductID = ?", [stock, id]);
        return true;
    },

    // 2. Ẩn/Hiện sản phẩm (Admin)
    toggleProductStatus: async (id, status) => {
        await pool.query("UPDATE Products SET Status = ? WHERE ProductID = ?", [status, id]);
        return true;
    },

    // 3. Đánh giá sản phẩm
    submitReview: async (userId, productId, orderId, rating, comment) => {
        // Có thể thêm bước kiểm tra xem khách đã mua hàng chưa thông qua OrderID
        const [result] = await pool.query(
            "INSERT INTO Reviews (UserID, ProductID, OrderID, Rating, Comment) VALUES (?, ?, ?, ?, ?)",
            [userId, productId, orderId, rating, comment]
        );
        return result.insertId;
    }
};

module.exports = productService;
