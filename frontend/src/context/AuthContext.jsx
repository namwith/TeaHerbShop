import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Kiểm tra trạng thái đăng nhập ngay khi load web
  useEffect(() => {
    const storedToken = localStorage.getItem("teaToken");
    const storedUsername = localStorage.getItem("teaUsername");
    const storedRole = localStorage.getItem("teaRole");

    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUser({ username: storedUsername, role: storedRole });
    }
  }, []);

  const login = (newToken, username, role) => {
    localStorage.setItem("teaToken", newToken);
    localStorage.setItem("teaUsername", username);
    localStorage.setItem("teaRole", role);
    setToken(newToken);
    setUser({ username, role });
  };

  const logout = () => {
    localStorage.removeItem("teaToken");
    localStorage.removeItem("teaUsername");
    localStorage.removeItem("teaRole");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
