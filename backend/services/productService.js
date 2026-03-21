const productRepo = require('../repositories/productRepository');
const { ProductType } = require('../constants/enums');

class ProductService {
    // 1. Lấy danh sách sản phẩm
    async getAllProducts() {
        return await productRepo.findAll();
    }

    // 2. Thêm mới sản phẩm (Kèm kiểm tra logic)
    async createProduct(data) {
        // Validation: Kiểm tra dữ liệu đầu vào
        if (!data.Name || !data.Price) {
            throw new Error("Tên và giá sản phẩm là bắt buộc!");
        }
        if (data.Price <= 0) {
            throw new Error("Giá sản phẩm phải lớn hơn 0!");
        }
        
        // Kiểm tra loại sản phẩm có đúng chuẩn Enum không
        const validTypes = Object.values(ProductType);
        if (!validTypes.includes(data.Type)) {
            throw new Error(`Loại sản phẩm không hợp lệ! Chỉ chấp nhận: ${validTypes.join(', ')}`);
        }

        // Vượt qua hết bài test -> Gọi Repository lưu vào DB
        return await productRepo.create(data);
    }

    // 3. Cập nhật sản phẩm
    async updateProduct(id, data) {
        // Kiểm tra xem sản phẩm có tồn tại không trước khi sửa
        const existingProduct = await productRepo.findById(id);
        if (!existingProduct) {
            throw new Error("Không tìm thấy sản phẩm này trong hệ thống!");
        }

        if (data.Price && data.Price <= 0) {
            throw new Error("Giá cập nhật phải lớn hơn 0!");
        }

        return await productRepo.update(id, data);
    }

    // 4. Xóa sản phẩm
    async deleteProduct(id) {
        const existingProduct = await productRepo.findById(id);
        if (!existingProduct) {
            throw new Error("Không tìm thấy sản phẩm để xóa!");
        }

        return await productRepo.delete(id);
    }
}

module.exports = new ProductService();