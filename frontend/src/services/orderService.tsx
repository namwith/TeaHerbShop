import api from "../api/axios";

export const createOrder = (payload: {
  cartItems: Array<{ id: number; name: string; price: number; image?: string; quantity: number }>;
  totalAmount: number;
  shippingAddress: string;
  receiverPhone: string;
  paymentMethod: string;
}) => {
  return api.post("/orders", payload);
};

export const getMyOrders = () => {
  return api.get("/orders/me");
};

export const getMyOrderDetails = (orderId: number | string) => {
  return api.get(`/orders/me/${orderId}`);
};

export const cancelOrder = (orderId: number) => {
  return api.put(`/orders/${orderId}/cancel`);
};
