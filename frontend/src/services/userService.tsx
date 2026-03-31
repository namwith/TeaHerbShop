import api from "../api/axios";

export const getProfile = () => {
  return api.get("/users/profile");
};

export const updateProfile = (profileData: { fullName?: string; phone?: string; address?: string; email?: string }) => {
  return api.put("/users/profile", profileData);
};
