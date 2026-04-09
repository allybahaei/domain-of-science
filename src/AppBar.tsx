import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";

export default function AppBar() {
  const navigate = useNavigate();

  return (
    <header style={styles.bar}>
      <button type="button" onClick={() => navigate("/")} style={styles.brand}>
        ExploreAI
      </button>
      <button type="button" style={styles.profileBtn} aria-label="Profile">
        <span style={styles.profileLabel}>profile</span>
        <HugeiconsIcon icon={UserCircleIcon} size={20} strokeWidth={1.75} color="#3f3f46" />
      </button>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "14px 28px",
    boxSizing: "border-box",
    background: "#fff",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  brand: {
    border: "none",
    background: "none",
    padding: 0,
    fontSize: 16,
    fontWeight: 600,
    color: "#18181b",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  profileBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    background: "none",
    padding: "6px 4px",
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 8,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#52525b",
    textTransform: "lowercase",
  },
};
