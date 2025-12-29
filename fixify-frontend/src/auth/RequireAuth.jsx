import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
}
