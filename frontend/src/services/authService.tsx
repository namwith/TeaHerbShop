import api from "../api/axios";
import type { RegisterData, LoginData } from "../models/authModels.ts";

export const register = (data: RegisterData) => {
  return api.post("/auth/register", data);
};

export const login = (data: LoginData) => {
  return api.post("/auth/login", data);
};

export const logout = () => {
  return api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
};
