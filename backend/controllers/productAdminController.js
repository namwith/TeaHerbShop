const productService = require('../services/productService');

const getAdminProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sản phẩm' });
    }
};

const createProduct = async (req, res) => {
    try {
        // Service sẽ quăng lỗi (throw Error) nếu dữ liệu không hợp lệ
        const newProductId = await productService.createProduct(req.body);
        res.status(201).json({ 
            success: true, 
            message: '🎉 Thêm sản phẩm thành công!', 
            id: newProductId 
        });
    } catch (error) {
        // Bắt lỗi từ Service và trả về mã 400 (Bad Request)
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.updateProduct(id, req.body);
        res.status(200).json({ success: true, message: '🔄 Cập nhật sản phẩm thành công!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        res.status(200).json({ success: true, message: '🗑️ Xóa sản phẩm thành công!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { getAdminProducts, createProduct, updateProduct, deleteProduct };