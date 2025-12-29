import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  return localStorage.getItem("role") === "ADMIN"
    ? children
    : <Navigate to="/dashboard" />;
}
