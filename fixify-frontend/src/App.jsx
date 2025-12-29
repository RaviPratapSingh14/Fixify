import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminIssueList from "./pages/AdminIssueList";
import AdminUserManagement from "./pages/AdminUserManagement";

// ===============================
// 🔐 AUTH GUARDS
// ===============================
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const role = localStorage.getItem("role");
  return role === "ADMIN" ? children : <Navigate to="/dashboard" replace />;
}

// ===============================
// 🚀 APP ROUTES
// ===============================
export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>

        {/* ===============================
            PUBLIC ROUTES
        =============================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===============================
            USER ROUTES
        =============================== */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* ===============================
            ADMIN ROUTES
        =============================== */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminAnalytics />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/issues"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminIssueList />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminUserManagement />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        {/* ===============================
            ROOT REDIRECT
        =============================== */}
        <Route
          path="/"
          element={
            token
              ? role === "ADMIN"
                ? <Navigate to="/admin" replace />
                : <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* ===============================
            FALLBACK
        =============================== */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}
