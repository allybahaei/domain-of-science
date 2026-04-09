import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNotebook, saveScene } from "./store";
import { generateMindmap } from "./lib/generateMindmap";
import { buildExcalidrawElements } from "./lib/buildExcalidrawElements";

export default function NewNotebook() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateMindmap(topic.trim());
      const elements = buildExcalidrawElements(data);
      const nb = createNotebook(data.title || topic.trim());
      saveScene(nb.id, { elements, appState: {} });
      navigate(`/canvas/${nb.id}`);
    } catch (err) {
      console.error("Mindmap generation failed:", err);
      setError("Generation failed. Check your API key and try again.");
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>What do you want to learn?</h1>

      <div style={styles.textareaWrap}>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How can I help you today?"
          disabled={loading}
          style={styles.textarea}
          rows={2}
          autoFocus
        />

        <div style={styles.actionRow}>
          <button type="button" style={styles.actionBtn} disabled={loading}>
            youtube video
          </button>
          <button type="button" style={styles.actionBtn} disabled={loading}>
            upload files
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.bottomBar}>
          {loading && <span style={styles.hint}>Generating…</span>}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            style={{
              ...styles.submitBtn,
              opacity: loading || !topic.trim() ? 0.4 : 1,
              cursor: loading || !topic.trim() ? "not-allowed" : "pointer",
            }}
            aria-label="Generate mind map"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#faf9f6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: 24,
    boxSizing: "border-box",
  },
  heading: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 48,
    fontWeight: 400,
    color: "#1a1a1a",
    margin: "0 0 36px",
    textAlign: "center",
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  },
  textareaWrap: {
    width: "100%",
    maxWidth: 640,
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e4e4e7",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  textarea: {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: 16,
    lineHeight: 1.6,
    color: "#1a1a1a",
    padding: "14px 20px 6px",
    boxSizing: "border-box",
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "transparent",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    padding: "0 20px 10px",
  },
  actionBtn: {
    fontSize: 13,
    fontWeight: 500,
    color: "#52525b",
    background: "#fafafa",
    border: "1px solid #e4e4e7",
    borderRadius: 999,
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  bottomBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "8px 12px 12px",
    gap: 12,
  },
  hint: {
    fontSize: 13,
    color: "#a1a1aa",
    marginRight: "auto",
  },
  error: {
    fontSize: 13,
    color: "#dc2626",
    margin: 0,
    padding: "0 20px 4px",
  },
  submitBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "none",
    background: "#1a1a1a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    transition: "opacity 0.15s",
  },
};
