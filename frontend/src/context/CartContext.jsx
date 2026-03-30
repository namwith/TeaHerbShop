import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // 1. Thêm vào giỏ
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.ProductID === product.ProductID);
            if (existingItem) {
                // Nếu đã có trong giỏ -> Tăng số lượng
                return prevCart.map(item => 
                    item.ProductID === product.ProductID 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            // Nếu chưa có -> Thêm mới với số lượng 1
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // 2. Xóa khỏi giỏ
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.ProductID !== productId));
    };

    // 3. Xóa sạch giỏ (Dùng sau khi thanh toán xong)
    const clearCart = () => setCart([]);

    // 4. CẬP NHẬT SỐ LƯỢNG (TĂNG/GIẢM)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return; // Không cho phép giảm xuống dưới 1
        setCart(prevCart => prevCart.map(item => 
            item.ProductID === productId 
                ? { ...item, quantity: newQuantity } 
                : item
        ));
    };

    // Tính tổng tiền và tổng số lượng
    const cartTotal = cart.reduce((total, item) => total + (item.Price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};