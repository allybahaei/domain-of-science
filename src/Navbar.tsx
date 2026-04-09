import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-4 inset-x-0 flex justify-center z-100 pointer-events-none">
      <div className="flex items-center justify-between w-full max-w-[1000px] gap-2 bg-white/85 backdrop-blur-[12px] border border-zinc-200 rounded-[22px] py-2 pr-2 pl-5 pointer-events-auto">
        <span
          onClick={() => navigate("/")}
          className="text-[15px] font-semibold text-zinc-900 cursor-pointer mr-3"
        >
          ExploreAI
        </span>

        <div className="flex gap-1">
          <a href="#features" className="text-sm font-[450] text-zinc-600 no-underline px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
            Features
          </a>
          <a href="#about" className="text-sm font-[450] text-zinc-600 no-underline px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
            About
          </a>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm font-medium text-white bg-zinc-900 rounded-[14px] px-[18px] py-2 cursor-pointer ml-2 transition-colors"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
