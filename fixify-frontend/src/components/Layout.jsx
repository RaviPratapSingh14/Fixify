import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function Layout({ children }) {
  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Fixify</h1>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <ThemeToggle />
          <UserMenu name="Ravi" />
        </div>
      </header>

      {/* Main Content Render */}
      {children}
    </div>
  );
}
