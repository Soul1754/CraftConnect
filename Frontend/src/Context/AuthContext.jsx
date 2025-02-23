import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          return {
            token,
            role: decoded.role,
            isAuthenticated: true,
          };
        }
      } catch (error) {
        console.error("Failed to decode token on initial load:", error);
      }
    }
    return { token: null, role: null, isAuthenticated: false };
  });

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      setAuth({
        token,
        role: decoded.role,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Failed to decode token during login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({
      token: null,
      role: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {" "}
      {/* ✅ Fix: Added value */}
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook (Optional, for better usability)
export const useAuth = () => useContext(AuthContext);
