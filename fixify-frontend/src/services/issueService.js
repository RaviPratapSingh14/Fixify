// src/services/issueService.js
import API from "./api";

export const getAllIssues = () => API.get("/issues");
export const createIssue = (data) => API.post("/issues", data);
export const updateIssueStatus = (id, status) =>
  API.put(`/issues/${id}/status`, { status });
