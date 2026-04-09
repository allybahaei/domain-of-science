import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import { getNotebooks, deleteNotebook, type Notebook } from "./store";

const EMOJIS = ["💻", "🧩", "🤖", "🔐", "📚", "🎯", "🧠", "✨"];

const CARD_BACKGROUNDS = ["#f1f1e8", "#f0eaf1"] as const;

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function emojiForNotebook(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) >>> 0;
  return EMOJIS[h % EMOJIS.length];
}

function cardBackground(index: number) {
  return CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length];
}

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState<Notebook[]>(getNotebooks);
  const navigate = useNavigate();

  function handleCreate() {
    navigate("/new");
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteNotebook(id);
    setNotebooks(getNotebooks());
  }

  return (
    <div style={styles.page}>
      <AppBar />
      <div style={styles.main}>
        <div style={styles.container}>
        <h1 style={styles.heading}>Recent notebooks</h1>

        <div style={styles.grid}>
          <button type="button" onClick={handleCreate} style={styles.createCard}>
            <div style={styles.createIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="11" fill="#dbeafe" />
                <path
                  d="M12 7v10M7 12h10"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span style={styles.createLabel}>Create new notebook</span>
          </button>

          {notebooks.map((nb, index) => (
            <div
              key={nb.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/canvas/${nb.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/canvas/${nb.id}`);
                }
              }}
              style={{
                ...styles.noteCard,
                background: cardBackground(index),
              }}
            >
              <button
                type="button"
                onClick={(e) => handleDelete(e, nb.id)}
                style={styles.menuBtn}
                title="Delete notebook"
                aria-label="Delete notebook"
              >
                <span style={styles.menuDots}>⋮</span>
              </button>
              <span style={styles.emoji} aria-hidden>
                {emojiForNotebook(nb.id)}
              </span>
              <span style={styles.cardTitle}>{nb.title}</span>
              <span style={styles.cardMeta}>
                {formatDate(nb.updatedAt)} • 1 source
              </span>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    boxSizing: "border-box",
  },
  main: {
    flex: 1,
    padding: "32px 28px 64px",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 1120,
    margin: "0 auto",
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    color: "#18181b",
    margin: "0 0 28px",
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 18,
    alignItems: "stretch",
  },

  createCard: {
    borderRadius: 12,
    border: "1px solid #e4e4e7",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: "28px 20px",
    minHeight: 200,
    textAlign: "center",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  createIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  createLabel: {
    fontSize: 15,
    fontWeight: 500,
    color: "#3f3f46",
    lineHeight: 1.35,
    maxWidth: 160,
  },

  noteCard: {
    position: "relative",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.06)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 20,
    minHeight: 200,
    textAlign: "left",
    transition: "box-shadow 0.15s, transform 0.15s",
  },
  menuBtn: {
    position: "absolute",
    top: 14,
    right: 12,
    width: 32,
    height: 32,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#71717a",
    padding: 0,
  },
  menuDots: {
    fontSize: 18,
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: 0,
    transform: "translateY(-1px)",
  },
  emoji: {
    fontSize: 40,
    lineHeight: 1,
    marginBottom: 14,
    display: "block",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#18181b",
    lineHeight: 1.35,
    width: "100%",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    flex: 1,
    marginBottom: 12,
  },
  cardMeta: {
    fontSize: 13,
    color: "#71717a",
    marginTop: "auto",
    width: "100%",
  },
};
