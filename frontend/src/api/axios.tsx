import axios from "axios";

// 1. Tạo một "bản sao" của axios với đường dẫn mặc định
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. INTERCEPTOR - "Người gác cổng" tự động đính kèm Token
api.interceptors.request.use(
  (config) => {
    // Lấy token từ LocalStorage (Tên token phải khớp với lúc bạn lưu ở AuthContext)
    const token = localStorage.getItem("teaToken");

    // Nếu có token, tự động gắn vào Header của mọi Request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
