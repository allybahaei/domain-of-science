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
    <div className="min-h-screen bg-white flex flex-col">
      <AppBar />
      <div className="flex-1 px-7 pt-8 pb-16">
        <div className="max-w-[1120px] mx-auto">
          <h1 className="text-[22px] font-semibold text-zinc-900 mb-7 tracking-[-0.02em]">
            Recent notebooks
          </h1>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[18px] items-stretch">
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-xl border border-zinc-200 bg-white cursor-pointer flex flex-col items-center justify-center gap-4 px-5 py-7 min-h-[200px] text-center transition-[border-color,box-shadow]"
            >
              <div className="flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="11" fill="#dbeafe" />
                  <path d="M12 7v10M7 12h10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-zinc-700 leading-[1.35] max-w-[160px]">
                Create new notebook
              </span>
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
                className="relative rounded-xl border border-black/[0.06] cursor-pointer flex flex-col items-start p-5 min-h-[200px] text-left transition-[box-shadow,transform]"
                style={{ background: cardBackground(index) }}
              >
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, nb.id)}
                  className="absolute top-3.5 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 p-0 cursor-pointer"
                  title="Delete notebook"
                  aria-label="Delete notebook"
                >
                  <span className="text-lg leading-none font-bold -translate-y-px">⋮</span>
                </button>
                <span className="text-[40px] leading-none mb-3.5 block" aria-hidden>
                  {emojiForNotebook(nb.id)}
                </span>
                <span className="text-[15px] font-semibold text-zinc-900 leading-[1.35] w-full line-clamp-3 flex-1 mb-3">
                  {nb.title}
                </span>
                <span className="text-[13px] text-zinc-500 mt-auto w-full">
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
