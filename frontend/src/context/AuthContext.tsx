import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{ token, role, isAuthenticated, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
