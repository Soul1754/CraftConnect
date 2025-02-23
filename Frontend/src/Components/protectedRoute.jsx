// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}
