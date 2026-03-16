const { sql } = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Products');
        
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { getProducts };