// src/components/FloatingReportButton.jsx
import React from "react";
import { FaPlus } from "react-icons/fa";

export default function FloatingReportButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="floating-report-btn"
      style={fabStyle}
    >
      <FaPlus size={20} />
    </button>
  );
}

const fabStyle = {
  position: "fixed",
  bottom: "25px",
  right: "25px",
  backgroundColor: "#0d6efd",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "58px",
  height: "58px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "24px",
  cursor: "pointer",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
  transition: "all 0.3s ease",
  zIndex: 9999,
};
