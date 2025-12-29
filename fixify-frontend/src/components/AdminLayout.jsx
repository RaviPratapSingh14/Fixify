import FixifyNavbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <FixifyNavbar />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
