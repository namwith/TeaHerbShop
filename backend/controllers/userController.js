const { pool } = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT UserID, Username, Role, FullName, Phone, Address, Avatar, Status, CreatedAt FROM Users WHERE UserID = ?",
      [userId],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("❌ Lỗi lấy profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy hồ sơ" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { FullName, Phone, Address } = req.body;

    await pool.query(
      "UPDATE Users SET FullName = ?, Phone = ?, Address = ? WHERE UserID = ?",
      [FullName || "", Phone || "", Address || "", userId],
    );

    res
      .status(200)
      .json({ success: true, message: "Cập nhật hồ sơ thành công!" });
  } catch (error) {
    console.error("❌ Lỗi cập nhật profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật hồ sơ" });
  }
};

module.exports = { getProfile, updateProfile };
