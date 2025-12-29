// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

import API from "../services/api";
import AdminLayout from "../components/AdminLayout";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ new: 0, inProgress: 0, fixed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // LOAD ISSUES
  // ===============================
  const loadIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/issues");

      setIssues(res.data);
      setStats({
        new: res.data.filter(i => i.status === "NEW").length,
        inProgress: res.data.filter(i => i.status === "IN_PROGRESS").length,
        fixed: res.data.filter(i => i.status === "FIXED").length,
      });
    } catch {
      setError("Failed to load issues. Backend might be offline.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/issues/${id}/status`, { status });
      loadIssues();
    } catch {
      alert("Status update failed");
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  return (
    <AdminLayout>
      <h3 className="mb-4 fw-bold">🚀 Admin Dashboard</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* ===============================
              STATS GRID (STEP 3)
          =============================== */}
          <div className="dashboard-stats">
            <div className="stat-glass primary">
              <h3>{stats.new}</h3>
              <p>New Issues</p>
            </div>

            <div className="stat-glass warning">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>

            <div className="stat-glass success">
              <h3>{stats.fixed}</h3>
              <p>Fixed</p>
            </div>
          </div>

          {/* ===============================
              CHARTS GRID (STEP 3)
          =============================== */}
          <div className="dashboard-charts">
            <div className="chart-card">
              <h6>Status Breakdown</h6>
              <Pie
                data={{
                  labels: ["NEW", "IN_PROGRESS", "FIXED"],
                  datasets: [
                    {
                      data: [stats.new, stats.inProgress, stats.fixed],
                      backgroundColor: ["#0d6efd", "#ffc107", "#198754"],
                    },
                  ],
                }}
              />
            </div>

            <div className="chart-card">
              <h6>Issues Overview</h6>
              <Bar
                data={{
                  labels: ["NEW", "IN_PROGRESS", "FIXED"],
                  datasets: [
                    {
                      label: "Issues Count",
                      data: [stats.new, stats.inProgress, stats.fixed],
                      backgroundColor: ["#0d6efd", "#ffc107", "#198754"],
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* ===============================
              ISSUES TABLE (STEP 4)
          =============================== */}
          <h5 className="fw-bold mt-5">📋 All Reported Issues</h5>

          <div className="glass-table mt-3">
            <div className="table-wrapper">
              <table className="table issue-table align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Reporter</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th style={{ width: 120 }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {issues.map(i => (
                    <tr key={i.id}>
                      <td className="fw-semibold">{i.title}</td>
                      <td>{i.createdBy}</td>
                      <td>
                        <span className={`status-pill ${i.status.toLowerCase()}`}>
                          {i.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="text-muted small">{i.address}</td>
                      <td>
                        <Button
                          size="sm"
                          className="action-btn"
                          variant="outline-primary"
                          onClick={() =>
                            updateStatus(
                              i.id,
                              i.status === "NEW" ? "IN_PROGRESS" : "FIXED"
                            )
                          }
                        >
                          Next →
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
