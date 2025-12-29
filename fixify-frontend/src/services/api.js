import axios from "axios";

// Dynamic backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Create axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status } = error.response;

      // ❗ Avoid logout while user is already on Login API
      const isAuthCall =
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/signup");

      if (status === 401 && !isAuthCall) {
        console.warn("⚠️ Session expired. Logging out...");

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Network error: Backend unreachable.");
    }

    return Promise.reject(error);
  }
);

export default API;
