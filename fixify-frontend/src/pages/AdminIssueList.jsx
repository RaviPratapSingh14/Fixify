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
} from "react-bootstrap";
import FixifyNavbar from "../components/Navbar";
import API from "../services/api";

export default function AdminIssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // 🔄 LOAD ISSUES (ADMIN API)
  // ===============================
  const loadIssues = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/issues");

      const filtered = filter
        ? res.data.filter((i) => i.status === filter)
        : res.data;

      setIssues(filtered);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load issues. Are you logged in as ADMIN?");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔄 UPDATE STATUS (ADMIN API)
  // ===============================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/issues/${id}/status`, {
        status,
        updatedBy: localStorage.getItem("username") || "ADMIN",
      });

      loadIssues();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update issue status.");
    }
  };

  // ===============================
  // ❌ DELETE ISSUE (ADMIN API)
  // ===============================
  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue permanently?")) return;

    try {
      await API.delete(`/admin/issues/${id}`);
      loadIssues();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete issue.");
    }
  };

  useEffect(() => {
    loadIssues();
  }, [filter]);

  const openModal = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  return (
    <>
      <FixifyNavbar />

      <Container className="py-4">
        <h2 className="fw-bold text-primary mb-4">🛠 Manage Issues</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex justify-content-between mb-3">
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "220px" }}
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="FIXED">FIXED</option>
          </Form.Select>

          <Button variant="secondary" onClick={loadIssues}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : issues.length === 0 ? (
          <p className="text-muted">No issues found.</p>
        ) : (
          <Table bordered hover responsive className="shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue, idx) => (
                <tr key={issue.id}>
                  <td>{idx + 1}</td>
                  <td>{issue.title}</td>

                  <td>
                    <Form.Select
                      size="sm"
                      value={issue.status}
                      onChange={(e) =>
                        updateStatus(issue.id, e.target.value)
                      }
                    >
                      <option value="NEW">NEW</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="FIXED">FIXED</option>
                    </Form.Select>
                  </td>

                  <td>{issue.createdBy || "N/A"}</td>
                  <td>{issue.address || "N/A"}</td>

                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => openModal(issue)}
                    >
                      View
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteIssue(issue.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* DETAILS MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Issue Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedIssue ? (
              <>
                <p><strong>Title:</strong> {selectedIssue.title}</p>
                <p><strong>Description:</strong> {selectedIssue.description}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="badge bg-info">
                    {selectedIssue.status}
                  </span>
                </p>
                <p><strong>Address:</strong> {selectedIssue.address || "N/A"}</p>
                <p>
                  <strong>Coordinates:</strong><br />
                  Lat: {selectedIssue.latitude}<br />
                  Lng: {selectedIssue.longitude}
                </p>
                <p><strong>Reported By:</strong> {selectedIssue.createdBy}</p>

                {selectedIssue.imageUrl && (
                  <img
                    src={selectedIssue.imageUrl}
                    alt="Issue"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                )}
              </>
            ) : (
              <p>No data.</p>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
