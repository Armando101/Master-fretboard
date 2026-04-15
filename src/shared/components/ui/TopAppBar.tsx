import LanguageSelector from "./LanguageSelector";

interface TopAppBarProps {
  title?: string;
}

export default function TopAppBar({ title = "Guitar Atelier" }: TopAppBarProps) {
  return (
    <header
      className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16"
      style={{ backgroundColor: "#1c1b1b" }}
    >
      {/* Left: menu + brand */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-lg transition-colors hover:bg-[#2a2a2a]"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[#9ecaff]">menu</span>
        </button>
        <span
          className="text-xl font-bold tracking-tighter text-[#9ecaff]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </span>
      </div>

      {/* Right: language selector + avatar */}
      <div className="flex items-center gap-3">
        <LanguageSelector />
        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#404752]/30 bg-[#353535] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#bfc7d4] text-base">person</span>
        </div>
      </div>
    </header>
  );
}
