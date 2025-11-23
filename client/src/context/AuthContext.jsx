import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("authData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (err) {
        console.error("Failed to parse authData:", err);
      }
    }
    setLoading(false);
  }, []);

  const saveAuthData = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("authData", JSON.stringify({ user, token }));
  };

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authData");
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    const { user, token } = res.data;
    saveAuthData(user, token);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { user, token } = res.data;
    saveAuthData(user, token);
    return res.data;
  };

  const logout = () => {
    clearAuthData();
  };

  // attach token to axios instance
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
