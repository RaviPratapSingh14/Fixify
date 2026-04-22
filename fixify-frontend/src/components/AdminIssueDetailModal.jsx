// src/components/AdminIssueDetailModal.jsx
import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import API from "../services/api";

export default function AdminIssueDetailModal({
  show,
  onHide,
  issue,
  onUpdated,
}) {
  const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString() : "Not available";

  const [assignee, setAssignee] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (issue) {
      setStatus(issue.status);
      fetchTimeline();
    }
  }, [issue]);

  // ===============================
  // 📜 FETCH TIMELINE
  // ===============================
  const fetchTimeline = async () => {
    try {
      setTimelineLoading(true);
      const res = await API.get(
        `/admin/issues/${issue.id}/timeline`
      );
      setTimeline(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load timeline.");
    } finally {
      setTimelineLoading(false);
    }
  };

  // ===============================
  // 🔄 UPDATE STATUS
  // ===============================
  const updateStatus = async () => {
    try {
      await API.put(`/admin/issues/${issue.id}/status`, {
        status,
        updatedBy: localStorage.getItem("username") || "ADMIN",
      });

      onUpdated();
      fetchTimeline();
    } catch (err) {
      console.error(err);
      setError("Failed to update issue status.");
    }
  };

  // ===============================
  // 👷 ASSIGN ISSUE
  // ===============================
  const assignIssue = async () => {
    if (!assignee.trim()) {
      return setError("Please enter a username to assign.");
    }

    try {
      await API.put(`/admin/issues/${issue.id}/assign`, {
        assignedTo: assignee,
        assignedBy: localStorage.getItem("username") || "ADMIN",
      });

      setAssignee("");
      fetchTimeline();
      onUpdated();
    } catch (err) {
      console.error(err);
      setError("Failed to assign issue.");
    }
  };

  // ===============================
  // 💬 ADD COMMENT
  // ===============================
  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      await API.post(`/admin/issues/${issue.id}/comment`, {
        message: comment,
        username: localStorage.getItem("username") || "ADMIN",
      });

      setComment("");
      fetchTimeline();
      onUpdated();
    } catch (err) {
      console.error(err);
      setError("Failed to add comment.");
    }
  };

  if (!issue) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🛠 Issue Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* ISSUE INFO */}
        <div className="p-3 bg-light rounded mb-3">
          <h5 className="text-primary">{issue.title}</h5>
          <p><strong>Description:</strong> {issue.description}</p>
          <p><strong>Category:</strong> {issue.category}</p>
          <p><strong>Priority:</strong> {issue.priority}</p>
          <p><strong>Address:</strong> {issue.address || "N/A"}</p>
          <p><strong>Reported by:</strong> {issue.createdBy}</p>
          <p><strong>Reported Date & Time:</strong> {formatDateTime(issue.reportedAt || issue.createdAt)}</p>
          <p><strong>Resolution Date & Time:</strong> {formatDateTime(issue.resolvedAt)}</p>
          {issue.imageUrl && <p><strong>Image:</strong> <a href={issue.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></p>}
        </div>

        {/* STATUS UPDATE */}
        <hr />
        <h6>🔄 Update Status</h6>
        <div className="d-flex gap-2 mb-3">
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FIXED">FIXED</option>
          </Form.Select>

          <Button variant="warning" onClick={updateStatus}>
            Update
          </Button>
        </div>

        <Badge bg="info">Current: {issue.status}</Badge>

        {/* ASSIGN */}
        <hr />
        <h6>👷 Assign Issue</h6>
        <div className="d-flex gap-2 mb-3">
          <Form.Control
            placeholder="Assign to username"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
          <Button variant="primary" onClick={assignIssue}>
            Assign
          </Button>
        </div>

        {/* TIMELINE */}
        <hr />
        <h6>🕒 Timeline</h6>

        {timelineLoading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <ListGroup style={{ maxHeight: 220, overflowY: "auto" }}>
            {timeline.length === 0 ? (
              <ListGroup.Item className="text-muted">
                No timeline events.
              </ListGroup.Item>
            ) : (
              timeline.map((t, idx) => (
                <ListGroup.Item key={idx}>
                  <strong>{t.event}</strong> — {t.message}
                  <div className="small text-muted">
                    By {t.createdBy} at {formatDateTime(t.timestamp)}
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        )}

        {/* COMMENT */}
        <hr />
        <Form.Group>
          <Form.Label>Add Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
        </Form.Group>

        <Button
          className="mt-2"
          variant="success"
          onClick={addComment}
        >
          Add Comment
        </Button>
      </Modal.Body>
    </Modal>
  );
}
