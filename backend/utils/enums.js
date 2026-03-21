// Định nghĩa các loại sản phẩm cố định trong hệ thống
const ProductType = {
    TEA: 'tea',         // Trà
    HERB: 'herb'        // Thảo mộc
};

// Định nghĩa trạng thái đơn hàng (Dùng cho sau này)
const OrderStatus = {
    PENDING: 'Đang xử lý',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy'
};

module.exports = { ProductType, OrderStatus };