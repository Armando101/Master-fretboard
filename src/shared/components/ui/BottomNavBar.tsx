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

