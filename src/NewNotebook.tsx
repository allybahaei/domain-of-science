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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="font-display text-5xl font-normal text-zinc-900 mb-9 text-center tracking-[-0.02em] leading-[1.15]">
        What do you want to learn?
      </h1>

      <div className="w-full max-w-[640px] bg-white rounded-2xl border border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How can I help you today?"
          disabled={loading}
          className="w-full border-none outline-none resize-none text-base leading-relaxed text-zinc-900 pt-3.5 px-5 pb-1.5 bg-transparent"
          rows={2}
          autoFocus
        />

        <div className="flex flex-wrap gap-2 px-5 pb-2.5">
          <button
            type="button"
            className="text-[13px] font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-full px-3.5 py-1.5 cursor-pointer"
            disabled={loading}
          >
            youtube video
          </button>
          <button
            type="button"
            className="text-[13px] font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-full px-3.5 py-1.5 cursor-pointer"
            disabled={loading}
          >
            upload files
          </button>
        </div>

        {error && <p className="text-[13px] text-red-600 px-5 pb-1">{error}</p>}

        <div className="flex items-center justify-end px-3 pt-2 pb-3 gap-3">
          {loading && <span className="text-[13px] text-zinc-400 mr-auto">Generating…</span>}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-9 h-9 rounded-[10px] bg-zinc-900 text-white flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
