// src/routes/AdminRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but not admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized ADMIN
  return children;
}
