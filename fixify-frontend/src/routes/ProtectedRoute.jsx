// src/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Admin should not access user dashboard
  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Authenticated USER
  return children;
}
