// src/pages/AdminIssueList.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Spinner,
  Modal,
  Alert,
  Toast,
  ToastContainer,
  Badge,
} from "react-bootstrap";
import FixifyNavbar from "../components/Navbar";
import API from "../services/api";

const formatDateTime = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

export default function AdminIssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // newest first
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/issues");

      let filtered = filter
        ? res.data.filter((i) => i.status === filter)
        : res.data;

      filtered.sort((a, b) => {
        const aTime = a.reportedAt || a.createdAt || 0;
        const bTime = b.reportedAt || b.createdAt || 0;
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      });

      setIssues(filtered);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load issues. Are you logged in as ADMIN?");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/issues/${id}/status`, {
        status,
        updatedBy: localStorage.getItem("username") || "ADMIN",
      });

      setToastMessage("Issue status updated successfully");
      setShowToast(true);
      loadIssues();
    } catch (err) {
      console.error(err);
      setError("Failed to update issue status.");
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue permanently?")) return;

    try {
      await API.delete(`/admin/issues/${id}`);
      loadIssues();
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue.");
    }
  };

  useEffect(() => {
    loadIssues();
  }, [filter, sortOrder]);

  const openModal = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  return (
    <>
      <FixifyNavbar />

      <Container className="py-4">
        <div className="admin-issue-header mb-4">
          <div>
            <h2 className="fw-bold mb-1">Manage Issues</h2>
            <p className="mb-0 text-muted">
              Track reporting and resolution dates with quick status updates.
            </p>
          </div>
          <Button variant="outline-secondary" onClick={loadIssues}>
            Refresh
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="admin-issue-filters mb-3">
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="admin-issue-filter-select"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FIXED">FIXED</option>
          </Form.Select>

          <Form.Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="admin-issue-filter-select"
          >
            <option value="desc">Newest Reported</option>
            <option value="asc">Oldest Reported</option>
          </Form.Select>
        </div>

        <div className="admin-issue-table-wrap">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : issues.length === 0 ? (
            <p className="text-muted px-3 py-4 mb-0">No issues found.</p>
          ) : (
            <Table bordered hover responsive className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Reported By</th>
                  <th>Reported On</th>
                  <th>Resolved On</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {issues.map((issue, idx) => {
                  const reportedAt = issue.reportedAt || issue.createdAt;
                  return (
                    <tr key={issue.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="fw-semibold">{issue.title}</div>
                        <small className="text-muted">{issue.address || "N/A"}</small>
                      </td>

                      <td style={{ minWidth: 180 }}>
                        <Form.Select
                          size="sm"
                          value={issue.status}
                          onChange={(e) => updateStatus(issue.id, e.target.value)}
                        >
                          <option value="NEW">NEW</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="FIXED">FIXED</option>
                        </Form.Select>
                      </td>

                      <td>{issue.createdBy || "N/A"}</td>

                      <td>
                        <span className="time-chip">
                          {formatDateTime(reportedAt)}
                        </span>
                      </td>

                      <td>
                        <span className="time-chip time-chip-success">
                          {formatDateTime(issue.resolvedAt)}
                        </span>
                      </td>

                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-2"
                          onClick={() => openModal(issue)}
                        >
                          View
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteIssue(issue.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Issue Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedIssue ? (
              <div className="issue-detail-grid">
                <p><strong>Title:</strong> {selectedIssue.title}</p>
                <p><strong>Description:</strong> {selectedIssue.description}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge bg="info">{selectedIssue.status}</Badge>
                </p>
                <p><strong>Address:</strong> {selectedIssue.address || "N/A"}</p>
                <p><strong>Reported By:</strong> {selectedIssue.createdBy || "N/A"}</p>
                <p>
                  <strong>Reported Date & Time:</strong>{" "}
                  {formatDateTime(selectedIssue.reportedAt || selectedIssue.createdAt)}
                </p>
                <p>
                  <strong>Resolution Date & Time:</strong>{" "}
                  {formatDateTime(selectedIssue.resolvedAt)}
                </p>
                <p>
                  <strong>Coordinates:</strong><br />
                  Lat: {selectedIssue.latitude}<br />
                  Lng: {selectedIssue.longitude}
                </p>

                {selectedIssue.imageUrl && (
                  <img
                    src={selectedIssue.imageUrl}
                    alt="Issue"
                    style={{ width: "100%", borderRadius: 10 }}
                  />
                )}
              </div>
            ) : (
              <p>No data.</p>
            )}
          </Modal.Body>
        </Modal>

        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </>
  );
}
