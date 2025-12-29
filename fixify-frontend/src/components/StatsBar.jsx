// src/components/StatsBar.jsx
import React from "react";
import { Card } from "react-bootstrap";

export default function StatsBar({ stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      <StatCard title="Total Issues" value={stats.total} color="#0d6efd" />
      <StatCard title="New Today" value={stats.newToday} color="#6610f2" />
      <StatCard title="In Progress" value={stats.inProgress} color="#ffc107" />
      <StatCard title="Resolved" value={stats.resolved} color="#198754" />
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <Card
      style={{
        padding: "16px",
        borderRadius: 14,
        background: "#fff",
        boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
      }}
    >
      <h6 style={{ color: "var(--secondary)", fontWeight: 500 }}>{title}</h6>
      <h3 style={{ color, fontWeight: 700 }}>{value}</h3>
    </Card>
  );
}
