// src/services/adminService.js
import API from "./api";

export const getAllUsers = () => API.get("/admin/users");
export const getAdminStats = () => API.get("/admin/stats");
export const promoteUser = (id) => API.put(`/admin/users/${id}/promote`);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
