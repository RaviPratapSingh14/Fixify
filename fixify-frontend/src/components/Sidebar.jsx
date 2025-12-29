// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

export default function Sidebar() {
  return (
    <div className="admin-sidebar-inner">
      <h5 className="sidebar-title">🛠 Admin Panel</h5>

      <Nav className="flex-column gap-1">
        <Nav.Link as={NavLink} to="/admin/dashboard">
          📊 Dashboard
        </Nav.Link>

        <Nav.Link as={NavLink} to="/admin/issues">
          🧾 Issues
        </Nav.Link>

        <Nav.Link as={NavLink} to="/admin/analytics">
          📈 Analytics
        </Nav.Link>

        <Nav.Link as={NavLink} to="/admin/users">
          👥 Manage Users
        </Nav.Link>
      </Nav>
    </div>
  );
}
