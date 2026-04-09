import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.badges}>
        <span style={styles.badgeGreen}>Fresh updates weekly</span>
        <span style={styles.badgeOutline}>ExploreAI for learners &gt;</span>
      </div>

      <h1 style={styles.heading}>
        Meet your intelligent learning
        <br />
        and research tool
      </h1>

      <p style={styles.sub}>
        Think visually. Map out ideas on an infinite canvas
        <br />
        and let AI guide your learning journey.
      </p>

      <button onClick={() => navigate("/dashboard")} style={styles.cta}>
        Start Exploring
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
    textAlign: "center",
    backgroundColor: "#fafafa",
    backgroundImage:
      "radial-gradient(circle at center, #d4d4d8 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "0 24px",
  },
  badges: {
    display: "flex",
    gap: 12,
    marginBottom: 48,
  },
  badgeGreen: {
    fontSize: 14,
    fontWeight: 500,
    color: "#166534",
    background: "#dcfce7",
    borderRadius: 999,
    padding: "6px 16px",
  },
  badgeOutline: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1a1a1a",
    background: "#fff",
    border: "1px solid #e4e4e7",
    borderRadius: 999,
    padding: "6px 16px",
  },
  heading: {
    fontSize: 80,
    fontWeight: 400,
    color: "#1a1a1a",
    margin: "0 0 24px",
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    fontFamily: "'Instrument Serif', serif",
    maxWidth: 900,
  },
  sub: {
    fontSize: 17,
    lineHeight: 1.6,
    color: "#71717a",
    margin: "0 0 40px",
    maxWidth: 520,
  },
  cta: {
    fontSize: 16,
    fontWeight: 500,
    color: "#1a1a1a",
    background: "#f0f0f0",
    border: "none",
    borderRadius: 999,
    padding: "14px 32px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
};
