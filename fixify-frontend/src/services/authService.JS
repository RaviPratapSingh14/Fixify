// src/services/authService.js
import API from "./api";

export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);
export const getProfile = () => API.get("/users/me");
export const updateProfile = (data) => API.put("/users/me", data);
export const changePassword = (data) => API.put("/users/me/password", data);
