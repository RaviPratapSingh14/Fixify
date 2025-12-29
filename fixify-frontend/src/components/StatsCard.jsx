// src/components/StatsCard.jsx
import { Card } from "react-bootstrap";

export default function StatsCard({ title, value, icon, color = "primary" }) {
  return (
    <Card className={`border-${color} shadow-sm mb-3`} style={{ minWidth: 220 }}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-uppercase text-muted mb-1 small">{title}</h6>
          <h3 className={`text-${color} fw-bold`}>{value}</h3>
        </div>
        <div
          className={`bg-${color} bg-opacity-10 p-3 rounded-circle text-${color}`}
          style={{ fontSize: 24 }}
        >
          {icon}
        </div>
      </Card.Body>
    </Card>
  );
}
