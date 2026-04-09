import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={styles.wrapper}>
      <div style={styles.pill}>
        <span onClick={() => navigate("/")} style={styles.logo}>
          ExploreAI
        </span>

        <div style={styles.links}>
          <a href="#features" style={styles.link}>
            Features
          </a>
          <a href="#about" style={styles.link}>
            About
          </a>
        </div>

        <button onClick={() => navigate("/dashboard")} style={styles.cta}>
          Get Started
        </button>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "fixed",
    top: 16,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 100,
    pointerEvents: "none",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 1000,
    gap: 8,
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid #e4e4e7",
    borderRadius: 999,
    padding: "8px 8px 8px 20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    pointerEvents: "auto",
  },
  logo: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1a1a1a",
    cursor: "pointer",
    marginRight: 12,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  links: {
    display: "flex",
    gap: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: 450,
    color: "#52525b",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 999,
    transition: "background 0.15s",
    cursor: "pointer",
  },
  cta: {
    fontSize: 14,
    fontWeight: 500,
    color: "#fff",
    background: "#1a1a1a",
    border: "none",
    borderRadius: 999,
    padding: "8px 18px",
    cursor: "pointer",
    marginLeft: 8,
    transition: "background 0.15s",
  },
};
