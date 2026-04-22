// src/components/UserMenu.jsx
import { useState, useRef, useEffect, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserMenu({ name = "User" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();               // ✅ clears context + localStorage
    navigate("/login");     // ✅ redirect
  };

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "8px",
        }}
        onClick={() => setOpen(!open)}
      >
        <FaUserCircle size={28} />
        <span style={{ fontWeight: 600 }}>{name}</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            width: "180px",
            zIndex: 999,
          }}
        >
          <button style={btnStyle} onClick={() => goTo("/profile")}>Profile</button>
          <button style={btnStyle} onClick={() => goTo("/my-issues")}>My Issues</button>
          <button style={btnStyle} onClick={() => goTo("/settings")}>Settings</button>
          <button
            style={{ ...btnStyle, color: "red" }}
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
};
