import api from "../api/axios";

export const getDashboardStats = () => {
  return api.get("/admin/dashboard");
};

export const getChartData = (query: string = "") => {
  return api.get(`/admin/chart-stats${query}`);
};

export const getAdminProducts = () => {
  return api.get("/admin/products");
};

export const createProduct = (data: FormData) => {
  return api.post("/admin/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = (id: number | string, data: FormData) => {
  return api.put(`/admin/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (id: number | string) => {
  return api.delete(`/admin/products/${id}`);
};

export const getAllOrders = () => {
  return api.get("/admin/orders");
};

export const getOrderDetails = (id: number | string) => {
  return api.get(`/admin/orders/${id}`);
};

export const updateOrderStatus = (id: number | string, status: string) => {
  return api.put(`/admin/orders/${id}/status`, { status });
};

export const getAllUsers = () => {
  return api.get("/admin/users");
};

export const updateUserStatus = (id: number | string, status: string) => {
  return api.put(`/admin/users/${id}/status`, { status });
};

export const deleteUser = (id: number | string) => {
  return api.delete(`/admin/users/${id}`);
};
