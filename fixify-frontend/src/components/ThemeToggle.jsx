// src/components/ThemeToggle.jsx
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={styles.button}
      className="theme-toggle-btn"
    >
      {theme === "dark" ? (
        <FaSun size={18} color="#ffeb3b" />
      ) : (
        <FaMoon size={18} color="#0d6efd" />
      )}
    </button>
  );
}

const styles = {
  button: {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "0.3s ease",
    boxShadow: "0 4px 10px var(--shadow)",
  },
};
