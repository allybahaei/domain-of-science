import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotebooks, createNotebook, deleteNotebook, type Notebook } from "./store";

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState<Notebook[]>(getNotebooks);
  const navigate = useNavigate();

  function handleCreate() {
    const nb = createNotebook(`Untitled ${notebooks.length + 1}`);
    setNotebooks(getNotebooks());
    navigate(`/canvas/${nb.id}`);
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteNotebook(id);
    setNotebooks(getNotebooks());
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Recent Maps</h1>

        <div style={styles.grid}>
          {/* Create new card */}
          <button onClick={handleCreate} style={styles.createCard}>
            <div style={styles.createIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span style={styles.createLabel}>New Notebook</span>
          </button>

          {/* Existing notebooks */}
          {notebooks.map((nb) => (
            <button
              key={nb.id}
              onClick={() => navigate(`/canvas/${nb.id}`)}
              style={styles.card}
            >
              <div style={styles.cardPreview}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <path d="M14 2v6h6" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="12" y2="17" />
                </svg>
              </div>
              <div style={styles.cardInfo}>
                <span style={styles.cardTitle}>{nb.title}</span>
                <span style={styles.cardDate}>{formatDate(nb.updatedAt)}</span>
              </div>
              <button
                onClick={(e) => handleDelete(e, nb.id)}
                style={styles.deleteBtn}
                title="Delete notebook"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#fafafa",
    padding: "48px 24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  container: {
    maxWidth: 960,
    margin: "0 auto",
  },
  heading: {
    fontSize: 28,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 28px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
  },

  createCard: {
    width: 200,
    height: 220,
    borderRadius: 14,
    border: "2px dashed #d4d4d8",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  createIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "#f3f0ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  createLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#7c3aed",
  },

  card: {
    width: 200,
    height: 220,
    borderRadius: 14,
    border: "1px solid #e5e5e5",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
    transition: "box-shadow 0.15s, border-color 0.15s",
    padding: 0,
    textAlign: "left",
  },
  cardPreview: {
    flex: 1,
    background: "#f9f7ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    padding: "10px 14px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardDate: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 6,
    border: "none",
    background: "rgba(0,0,0,0.05)",
    color: "#a1a1aa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    transition: "opacity 0.15s, background 0.15s",
  },
};
