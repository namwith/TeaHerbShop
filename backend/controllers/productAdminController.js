const { pool } = require("../config/db");
const fs = require("fs");
const path = require("path");
const productService = require("../services/productService");

const getAdminProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Products ORDER BY ProductID DESC",
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi lấy danh sách sản phẩm" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { Name, Type, Price, Description, name, type, price, description } = req.body;
    const finalName = Name || name;
    const finalType = Type || type;
    const finalPrice = Price || price || 0;
    const finalStock = req.body.Stock || req.body.stock || 100;
    const finalDesc = Description || description || "";

    // Nếu có upload ảnh thì lấy đường dẫn, không thì để null
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      "INSERT INTO Products (Name, Type, Price, Stock, Description, ImageURL) VALUES (?, ?, ?, ?, ?, ?)",
      [finalName, finalType, finalPrice, finalStock, finalDesc, imagePath],
    );

    res
      .status(201)
      .json({ success: true, message: "Thêm sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi thêm SP:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi thêm sản phẩm" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Type, Price, Description, name, type, price, description } = req.body;
    const finalName = Name || name;
    const finalType = Type || type;
    const finalPrice = Price || price || 0;
    const finalStock = req.body.Stock || req.body.stock || 0;
    const finalDesc = Description || description || "";

    let updateQuery =
      "UPDATE Products SET Name=?, Type=?, Price=?, Stock=?, Description=? WHERE ProductID=?";
    let params = [finalName, finalType, finalPrice, finalStock, finalDesc, id];

    // Nếu Admin có chọn ảnh mới thì cập nhật cả cột ImageURL
    if (req.file) {
      updateQuery =
        "UPDATE Products SET Name=?, Type=?, Price=?, Stock=?, Description=?, ImageURL=? WHERE ProductID=?";
      params = [
        finalName,
        finalType,
        finalPrice,
        finalStock,
        finalDesc,
        `/uploads/${req.file.filename}`,
        id,
      ];
    }

    await pool.query(updateQuery, params);
    res.status(200).json({ success: true, message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật SP:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Products WHERE ProductID = ?", [id]);
    res.status(200).json({ success: true, message: "Đã xóa sản phẩm!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Không thể xóa do sản phẩm đang nằm trong đơn hàng!",
      });
  }
};

// CẬP NHẬT KHO
const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    // Gọi Service thực hiện lệnh SQL
    await productService.updateProductStock(id, stock);
    
    res.status(200).json({ success: true, message: "Cập nhật kho thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật kho:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Gọi Service thực hiện lệnh SQL
    await productService.toggleProductStatus(id, status);
    
    res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái SP:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

module.exports = {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductStatus
};
