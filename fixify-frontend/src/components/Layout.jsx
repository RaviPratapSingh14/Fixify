import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function Layout({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "My Issues", path: "/my-issues" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Fixify</h1>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <ThemeToggle />
          <UserMenu name={user?.username || "User"} />
        </div>
      </header>

      <div className="user-nav-strip mb-3">
        {links.map((link) => (
          <button
            key={link.path}
            type="button"
            className={`user-nav-item ${
              location.pathname === link.path ? "active" : ""
            }`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Main Content Render */}
      {children}
    </div>
  );
}
