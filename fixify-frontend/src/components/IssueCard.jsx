// src/components/IssueCard.jsx
import { Card, Badge } from "react-bootstrap";

export default function IssueCard({ issue }) {
  const { title, description, address, status, createdBy } = issue;

  const statusColor =
    status === "FIXED"
      ? "success"
      : status === "IN_PROGRESS"
      ? "warning"
      : "info";

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="m-0">{title}</Card.Title>
          <Badge bg={statusColor}>{status}</Badge>
        </div>
        <Card.Text className="text-muted small">{description}</Card.Text>
        <Card.Text className="small mb-1">
          📍 <strong>Address:</strong> {address}
        </Card.Text>
        <Card.Text className="small">
          👤 <strong>Reported by:</strong> {createdBy}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
