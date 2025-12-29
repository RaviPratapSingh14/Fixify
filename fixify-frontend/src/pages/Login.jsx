import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

// ✅ Import background image
import loginBg from "../assets/Fixify.png";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/login", form);

      login(res.data);

      setSuccess("✅ Login successful! Redirecting...");

      setTimeout(() => {
        if (res.data.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "❌ Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.55),
          rgba(0,0,0,0.55)
        ), url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="p-4 shadow-lg border-0"
          style={{
            width: 360,
            background: "rgba(255,255,255,0.95)",
            borderRadius: "14px",
          }}
        >
          <h3
            className="mb-3 text-center fw-bold"
            style={{ color: "var(--primary)" }}
          >
            Welcome Back 👋
          </h3>

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

          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Enter username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              New here?{" "}
              <Link to="/signup" className="fw-semibold text-decoration-none">
                Create account
              </Link>
            </small>
          </div>
        </Card>
      </Container>
    </div>
  );
}
