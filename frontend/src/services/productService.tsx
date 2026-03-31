import api from "@/api/axios";
import type { Product } from "@/models/productModels";

export const getProducts = async () => {
  return await api.get<{ success: boolean; data: Product[] }>("/products");
};

export const getProductById = async (id: string | number) => {
  return await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
};

export const submitReview = async (payload: { productId: number; orderId: number; rating: number; comment: string }) => {
  return await api.post("/products/reviews", payload);
};
