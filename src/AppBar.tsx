import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";

export default function AppBar() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between w-full px-7 py-3.5 bg-white">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="p-0 text-base font-semibold text-zinc-900 cursor-pointer"
      >
        ExploreAI
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 px-1 py-1.5 cursor-pointer rounded-lg"
        aria-label="Profile"
      >
        <span className="text-sm font-medium text-zinc-600 lowercase">profile</span>
        <HugeiconsIcon icon={UserCircleIcon} size={20} strokeWidth={1.75} color="#3f3f46" />
      </button>
    </header>
  );
}
