const { sql } = require('../config/db');

class ProductRepository {
    
    // Lấy tất cả sản phẩm
    async findAll() {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Products ORDER BY ProductID DESC');
        return result.recordset;
    }

    // Lấy chi tiết 1 sản phẩm theo ID
    async findById(id) {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('ProductID', sql.Int, id)
            .query('SELECT * FROM Products WHERE ProductID = @ProductID');
        return result.recordset[0]; // Trả về 1 object duy nhất
    }

    // Thêm mới sản phẩm
    async create(productData) {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('Name', sql.NVarChar, productData.Name)
            .input('Type', sql.VarChar, productData.Type) // Dùng enum ở đây
            .input('Price', sql.Decimal(18,2), productData.Price)
            .input('Description', sql.NVarChar, productData.Description)
            .query(`
                INSERT INTO Products (Name, Type, Price, Description) 
                OUTPUT INSERTED.ProductID 
                VALUES (@Name, @Type, @Price, @Description)
            `);
        return result.recordset[0]; // Trả về ID vừa tạo
    }

    // Cập nhật sản phẩm
    async update(id, productData) {
        const pool = await sql.connect();
        await pool.request()
            .input('ProductID', sql.Int, id)
            .input('Name', sql.NVarChar, productData.Name)
            .input('Type', sql.VarChar, productData.Type)
            .input('Price', sql.Decimal(18,2), productData.Price)
            .input('Description', sql.NVarChar, productData.Description)
            .query(`
                UPDATE Products 
                SET Name = @Name, Type = @Type, Price = @Price, Description = @Description 
                WHERE ProductID = @ProductID
            `);
        return true;
    }

    // Xóa sản phẩm
    async delete(id) {
        const pool = await sql.connect();
        await pool.request()
            .input('ProductID', sql.Int, id)
            .query('DELETE FROM Products WHERE ProductID = @ProductID');
        return true;
    }
}

// Export một instance (đối tượng) duy nhất (Singleton Pattern)
module.exports = new ProductRepository();