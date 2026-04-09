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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button onClick={() => navigate("/dashboard")} style={styles.back}>
          &larr; Back
        </button>

        <h1 style={styles.heading}>New Mind Map</h1>
        <p style={styles.subtitle}>
          Enter a topic and we'll generate a mind map for you.
        </p>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
          placeholder="e.g. Machine Learning, Ancient Rome, Web Security..."
          disabled={loading}
          style={styles.input}
          autoFocus
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          style={{
            ...styles.button,
            background: loading ? "#999" : "#7c3aed",
            cursor: loading || !topic.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {loading && (
          <p style={styles.hint}>This may take a few seconds...</p>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e5e5",
    padding: "36px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  back: {
    alignSelf: "flex-start",
    background: "none",
    border: "none",
    color: "#7c3aed",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    padding: 0,
  },
  heading: {
    fontSize: 24,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#71717a",
    margin: 0,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d4d4d8",
    borderRadius: 10,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  },
  error: {
    fontSize: 13,
    color: "#dc2626",
    margin: 0,
  },
  button: {
    padding: "12px 0",
    borderRadius: 10,
    border: "none",
    color: "#fff",
    fontSize: 15,
    fontWeight: 500,
    width: "100%",
  },
  hint: {
    fontSize: 13,
    color: "#a1a1aa",
    textAlign: "center",
    margin: 0,
  },
};
