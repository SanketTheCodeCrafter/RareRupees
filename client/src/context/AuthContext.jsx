import { createContext, useContext, useEffect, useState } from "react";
import { loginAdmin } from "../api/auth.api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("rr_token");
    return stored ? stored.trim().replace(/[\r\n]+/gm, "") : null;
  });

  const [isAdmin, setIsAdmin] = useState(!!token);
  const [loading, setLoading] = useState(false);

  // LOGIN FUNCTION
  const login = async (username, password) => {
    try {
      setLoading(true);
      const data = await loginAdmin(username, password);

      let cleanToken = data.token.trim().replace(/[\r\n]+/gm, ""); // sanitize

      localStorage.setItem("rr_token", cleanToken);
      setToken(cleanToken);
      setIsAdmin(true);

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, message: err.response?.data?.message || "Login error" };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("rr_token");
    setToken(null);
    setIsAdmin(false);
  };

  // Listen for forced logout from Axios interceptor
  useEffect(() => {
    const handler = () => {
      logout();
      toast.error("Session expired. Please login again.");
    };
    window.addEventListener("rr-logout", handler);
    return () => window.removeEventListener("rr-logout", handler);
  }, []);

  const value = {
    token,
    isAdmin,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
