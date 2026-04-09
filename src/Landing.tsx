import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Businesses from "./Businesses";
import Examples from "./Examples";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-[#fafafa] pt-[200px]"
      style={{
        backgroundImage: "radial-gradient(circle at center, #d4d4d8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <Navbar />
      <div className="flex flex-col items-center text-center px-6 pb-12">
        <div className="flex gap-3 mb-12">
          <span className="text-sm font-medium text-green-800 bg-green-100 rounded-full px-4 py-1.5">
            Fresh updates weekly
          </span>
          <span className="text-sm font-medium text-zinc-900 bg-white border border-zinc-200 rounded-full px-4 py-1.5">
            ExploreAI for learners &gt;
          </span>
        </div>

        <h1 className="text-[80px] font-normal text-zinc-900 mb-6 leading-[1.05] tracking-[-0.02em] font-display whitespace-nowrap">
          Meet your intelligent learning
          <br />
          and research tool
        </h1>

        <p className="text-[17px] leading-relaxed text-zinc-500 mb-10 max-w-[520px]">
          Think visually. Map out ideas on an infinite canvas
          <br />
          and let AI guide your learning journey.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-base font-medium text-zinc-900 bg-zinc-100 rounded-full px-8 py-3.5 cursor-pointer transition-colors"
        >
          Start Exploring
        </button>
      </div>

      <Businesses />
      <Examples />
    </div>
  );
}
