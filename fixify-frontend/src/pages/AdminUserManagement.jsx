// src/pages/AdminUserManagement.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Card,
} from "react-bootstrap";
import API from "../services/api";
import Layout from "../components/Layout";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===============================
  // FETCH USERS
  // ===============================
  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("❌ Failed to load users. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UPDATE ROLE
  // ===============================
  const toggleRole = async (username, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    try {
      await API.put(`/admin/users/${username}/role`, { role: newRole });
      setSuccess(`✔ ${username} is now ${newRole}`);
      loadUsers();
    } catch (err) {
      setError("❌ Failed to update role.");
    }
  };

  // ===============================
  // DELETE USER
  // ===============================
  const deleteUser = async (username) => {
    if (!window.confirm(`Delete user: ${username}?`)) return;

    try {
      await API.delete(`/admin/users/${username}`);
      setSuccess(`🗑️ ${username} deleted successfully.`);
      loadUsers();
    } catch (err) {
      setError("❌ Failed to delete user.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Layout>
      <Container className="py-4">
        <h2 className="fw-bold mb-4">👥 User Management</h2>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Card className="p-3 shadow-sm theme-card">
            <Table hover responsive className="theme-table rounded">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ width: "220px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u, idx) => (
                    <tr key={u.id} className="align-middle">
                      <td>{idx + 1}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge
                          bg={u.role === "ADMIN" ? "success" : "secondary"}
                          className="px-3 py-2"
                        >
                          {u.role}
                        </Badge>
                      </td>

                      <td>
                        <Button
                          size="sm"
                          className="me-2"
                          variant={u.role === "ADMIN" ? "warning" : "primary"}
                          onClick={() => toggleRole(u.username, u.role)}
                        >
                          {u.role === "ADMIN"
                            ? "Demote to USER"
                            : "Promote to ADMIN"}
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteUser(u.username)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </Layout>
  );
}
