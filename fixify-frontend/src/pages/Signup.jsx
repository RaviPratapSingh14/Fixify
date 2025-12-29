import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
    adminSecret: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===============================
  // HANDLE SUBMIT
  // ===============================
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // ✅ Send adminSecret ONLY for ADMIN
      const payload =
        form.role === "ADMIN"
          ? form
          : {
              username: form.username,
              email: form.email,
              password: form.password,
              role: "USER"
            };

      await API.post("/auth/signup", payload);

      setSuccess("🎉 Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // HANDLE ROLE CHANGE
  // ===============================
  const handleRoleChange = (role) => {
    setForm({
      ...form,
      role,
      adminSecret: role === "ADMIN" ? form.adminSecret : ""
    });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg border-0" style={{ width: 400 }}>
        <h3 className="text-center mb-3 fw-bold">
          Create Account 🚀
        </h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={submit}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value.trim() })
              }
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              minLength={6}
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </Form.Group>

          {/* Role Selector */}
          <Form.Group className="mb-3">
            <Form.Label>Account Type</Form.Label>
            <Form.Select
              value={form.role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="USER">User (Report Issues)</option>
              <option value="ADMIN">Admin (Manage System)</option>
            </Form.Select>
          </Form.Group>

          {/* Admin Secret */}
          {form.role === "ADMIN" && (
            <Form.Group className="mb-3">
              <Form.Label>Admin Secret</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter admin secret"
                required
                value={form.adminSecret}
                onChange={(e) =>
                  setForm({ ...form, adminSecret: e.target.value })
                }
              />
            </Form.Group>
          )}

          <Button
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" /> Creating...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}
