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

  // 2. Lấy chi tiết 1 sản phẩm
  getProductById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM Products WHERE ProductID = ?",
      [id],
    );
    return rows.length ? rows[0] : null;
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
    }
};

module.exports = productService;
