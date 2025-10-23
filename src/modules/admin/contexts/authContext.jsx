import { createContext, useContext, useMemo, useState } from "react";
import { API } from "../../../config/api";
import { postJson } from "../../../utils/axiosApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  const isLogin = !!token;

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("accessToken", newToken);
  };

  const logout = async () => {
    await postJson(API.AUTH.LOGOUT);
    setToken(null);
    localStorage.removeItem("accessToken");
  };

  const value = useMemo(() => ({ isLogin , login, logout }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
