const { sql } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const pool = await sql.connect();
    const checkUser = await pool
      .request()
      .input("Username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (checkUser.recordset.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tên đăng nhập đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool
      .request()
      .input("Username", sql.VarChar, username)
      .input("PasswordHash", sql.VarChar, hashedPassword).query(`
                INSERT INTO Users (Username, PasswordHash, Role) 
                VALUES (@Username, @PasswordHash, 'user')
            `);

    res
      .status(201)
      .json({ success: true, message: "Đăng ký thành công! Hãy đăng nhập." });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi đăng ký" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("Username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    const user = result.recordset[0];

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }

    const token = jwt.sign(
      { id: user.UserID, username: user.Username, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token: token,
      user: { username: user.Username, role: user.Role },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi đăng nhập" });
  }
};

module.exports = { register, login };
