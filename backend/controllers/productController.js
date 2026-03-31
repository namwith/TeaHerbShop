const { pool } = require("../config/db");

const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Products ORDER BY ProductID DESC",
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy sản phẩm!" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Products WHERE ProductID = ?",
      [id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Lỗi lấy chi tiết SP:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

module.exports = { getProducts, getProductById };
