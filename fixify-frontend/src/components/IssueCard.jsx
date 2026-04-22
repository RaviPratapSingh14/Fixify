// src/components/IssueCard.jsx
import { Card, Badge } from "react-bootstrap";

export default function IssueCard({ issue }) {
  const {
    title,
    description,
    address,
    status,
    createdBy,
    createdAt,
    reportedAt,
    resolvedAt,
  } = issue;

  const statusColor =
    status === "FIXED"
      ? "success"
      : status === "IN_PROGRESS"
      ? "warning"
      : "info";

  const formattedReportedDate = reportedAt || createdAt
    ? new Date(reportedAt || createdAt).toLocaleString()
    : "Unknown";
  const formattedResolvedDate = resolvedAt
    ? new Date(resolvedAt).toLocaleString()
    : "Not resolved yet";

  return (
    <Card className="mb-3 shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="m-0 text-primary">{title}</Card.Title>
          <Badge bg={statusColor} className="fs-6">{status}</Badge>
        </div>
        <Card.Text className="text-muted small mb-2">{description}</Card.Text>
        <Card.Text className="small mb-1">
          📍 <strong>Address:</strong> {address}
        </Card.Text>
        <Card.Text className="small mb-1">
          👤 <strong>Reported by:</strong> {createdBy}
        </Card.Text>
        <Card.Text className="small text-secondary">
          🕒 <strong>Reported at:</strong> {formattedReportedDate}
        </Card.Text>
        <Card.Text className="small text-secondary mb-0">
          ✅ <strong>Resolved at:</strong> {formattedResolvedDate}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
