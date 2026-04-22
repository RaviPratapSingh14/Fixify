import { useEffect, useState } from "react";
import { Alert, Badge, Card, Form, Spinner, Table } from "react-bootstrap";
import Layout from "../components/Layout";
import API from "../services/api";

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "Not available";

const statusBadgeClass = (status) => {
  if (status === "FIXED") return "issue-status-chip fixed";
  if (status === "IN_PROGRESS") return "issue-status-chip progress";
  return "issue-status-chip new";
};

export default function MyIssues() {
  const username = localStorage.getItem("username") || "";

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/issues", {
        params: { createdBy: username },
      });
      setIssues(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load your issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const filtered = filter ? issues.filter((i) => i.status === filter) : issues;

  return (
    <Layout>
      <Card className="user-page-card my-issues-card p-0 overflow-hidden">
        <div className="user-page-hero issues-hero">
          <div>
            <h3 className="mb-1">My Issues</h3>
            <p className="mb-0">Track your reported issues and their progress.</p>
          </div>
          <Form.Select
            className="issues-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FIXED">FIXED</option>
          </Form.Select>
        </div>

        <div className="p-3 p-md-4">
          <div className="issues-stat-row mb-3">
            <Badge className="issues-badge total">Total: {issues.length}</Badge>
            <Badge className="issues-badge new">New: {issues.filter((i) => i.status === "NEW").length}</Badge>
            <Badge className="issues-badge progress">
              In Progress: {issues.filter((i) => i.status === "IN_PROGRESS").length}
            </Badge>
            <Badge className="issues-badge fixed">Fixed: {issues.filter((i) => i.status === "FIXED").length}</Badge>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="py-4 text-center">
              <Spinner animation="border" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-data-state">
              <h6 className="mb-1">No issues found</h6>
              <p className="mb-0">Try changing the status filter.</p>
            </div>
          ) : (
            <div className="issues-table-wrap">
              <Table bordered hover responsive className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Reported Date & Time</th>
                    <th>Resolution Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((issue) => (
                    <tr key={issue.id}>
                      <td className="fw-semibold">{issue.title}</td>
                      <td>
                        <span className={statusBadgeClass(issue.status)}>
                          {issue.status}
                        </span>
                      </td>
                      <td>{formatDateTime(issue.reportedAt || issue.createdAt)}</td>
                      <td>{formatDateTime(issue.resolvedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </Layout>
  );
}
