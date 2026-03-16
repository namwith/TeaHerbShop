const { sql } = require('../config/db');

const createOrder = async (req, res) => {
    try {
        const { cartItems, totalAmount } = req.body;

        // Kiểm tra nếu giỏ hàng trống
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng của bạn đang trống!' });
        }

        const pool = await sql.connect();

        // 1. Lưu vào bảng Orders và lấy ra OrderID vừa được tạo
        const orderResult = await pool.request()
            .input('TotalAmount', sql.Decimal(18,2), totalAmount)
            .input('UserID', sql.Int, req.user.id)
            .query(`
                INSERT INTO Orders (TotalAmount) 
                OUTPUT INSERTED.OrderID 
                VALUES (@TotalAmount)
            `);
        
        const orderId = orderResult.recordset[0].OrderID;

        // 2. Lặp qua từng sản phẩm trong giỏ và lưu vào bảng OrderDetails
        for (let item of cartItems) {
            await pool.request()
                .input('OrderID', sql.Int, orderId)
                .input('ProductID', sql.Int, item.id)
                .input('Quantity', sql.Int, item.quantity)
                .input('Price', sql.Decimal(18,2), item.price)
                .query(`
                    INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Price) 
                    VALUES (@OrderID, @ProductID, @Quantity, @Price)
                `);
        }

        res.status(200).json({ 
            success: true, 
            message: '🎉 Đặt hàng thành công!', 
            orderId: orderId 
        });

    } catch (error) {
        console.error('❌ Lỗi khi tạo đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi đặt hàng' });
    }
};

module.exports = { createOrder };