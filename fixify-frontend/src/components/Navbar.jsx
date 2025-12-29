// src/components/Navbar.jsx
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();              // ✅ clear AuthContext + localStorage
    navigate("/login");    // ✅ redirect
  };

  const goHome = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <header className="admin-navbar">
      {/* LEFT */}
      <div className="nav-left">
        <h4 className="brand" onClick={goHome} style={{ cursor: "pointer" }}>
          🛠 Fixify
        </h4>

        {user?.role === "ADMIN" && (
          <nav className="admin-nav-links">
            <span
              className={isActive("/admin/dashboard") ? "active" : ""}
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </span>

            <span
              className={isActive("/admin/analytics") ? "active" : ""}
              onClick={() => navigate("/admin/analytics")}
            >
              Analytics
            </span>

            <span
              className={isActive("/admin/issues") ? "active" : ""}
              onClick={() => navigate("/admin/issues")}
            >
              Issues
            </span>

            <span
              className={isActive("/admin/users") ? "active" : ""}
              onClick={() => navigate("/admin/users")}
            >
              Users
            </span>
          </nav>
        )}
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <ThemeToggle />

        {user && (
          <>
            <span className="user-badge">
              👋 {user.username}
              <span className="role-badge">{user.role}</span>
            </span>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
