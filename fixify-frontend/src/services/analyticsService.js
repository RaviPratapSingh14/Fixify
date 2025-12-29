// src/services/analyticsService.js
import API from "./api";

export const getIssueTrends = () => API.get("/admin/analytics/issues");
export const getUserGrowth = () => API.get("/admin/analytics/users");
