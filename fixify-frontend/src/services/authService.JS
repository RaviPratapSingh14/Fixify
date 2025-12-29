// src/services/authService.js
import API from "./api";

export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);
export const getProfile = () => API.get("/auth/profile");
