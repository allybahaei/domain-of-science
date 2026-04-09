import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Meet your intelligent learning tool</h1>
      <p style={styles.sub}>Think visually. Map out ideas on an infinite canvas.</p>
      <button onClick={() => navigate("/dashboard")} style={styles.cta}>
        Go to Dashboard
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#fafafa",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  heading: {
    fontSize: 48,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "0 0 12px",
    fontFamily: "'Instrument Serif', serif",
  },
  sub: {
    fontSize: 18,
    color: "#71717a",
    margin: "0 0 32px",
  },
  cta: {
    fontSize: 16,
    fontWeight: 500,
    color: "#fff",
    background: "#7c3aed",
    border: "none",
    borderRadius: 10,
    padding: "12px 28px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
};
