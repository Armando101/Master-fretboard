export type NavTab = "practice" | "library" | "progress";

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
}

function NavItem({ icon, label, isActive }: NavItemProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-300",
        isActive
          ? "text-[#ffe2ab] bg-[#ffbf00]/10"
          : "text-[#353535] hover:text-[#9ecaff]",
      ].join(" ")}
    >
      <span
        className="material-symbols-outlined"
        style={
          isActive
            ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
            : undefined
        }
      >
        {icon}
      </span>
      <span
        className="text-[10px] font-medium uppercase tracking-widest mt-1"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

interface BottomNavBarProps {
  activeTab?: NavTab;
}

export default function BottomNavBar({ activeTab = "practice" }: BottomNavBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full flex justify-around items-center pb-6 pt-3 px-8 z-50 border-t border-[#404752]/15"
      style={{
        backgroundColor: "rgba(19, 19, 19, 0.90)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 -4px 32px rgba(0, 97, 164, 0.08)",
      }}
    >
      <NavItem icon="fitness_center" label="Practice" isActive={activeTab === "practice"} />
      <NavItem icon="library_music" label="Library"  isActive={activeTab === "library"} />
      <NavItem icon="insights"      label="Progress"  isActive={activeTab === "progress"} />
    </nav>
  );
}
