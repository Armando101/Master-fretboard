"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import type { TrainingMode, TrainingModeOption } from "../../domain/main-menu.types";

const ACCENT_MAP: Record<
  TrainingModeOption["accentColor"],
  {
    cardHoverBorder: string;
    iconColor: string;
    ctaColor: string;
    ghostIcon: string;
  }
> = {
  primary: {
    cardHoverBorder: "hover:border-[#9ecaff]/20",
    iconColor: "text-[#9ecaff]",
    ctaColor: "text-[#9ecaff]",
    ghostIcon: "text-[#9ecaff]",
  },
  secondary: {
    cardHoverBorder: "hover:border-[#ffe2ab]/20",
    iconColor: "text-[#ffe2ab]",
    ctaColor: "text-[#ffe2ab]",
    ghostIcon: "text-[#ffe2ab]",
  },
  tertiary: {
    cardHoverBorder: "hover:border-[#4edea3]/20",
    iconColor: "text-[#4edea3]",
    ctaColor: "text-[#4edea3]",
    ghostIcon: "text-[#4edea3]",
  },
  outline: {
    cardHoverBorder: "hover:border-[#89919d]/20",
    iconColor: "text-[#89919d]",
    ctaColor: "text-[#89919d]",
    ghostIcon: "text-[#89919d]",
  },
};

// Map mode → translation key
const MODE_KEY_MAP: Record<TrainingMode, "intervals" | "closedTriads" | "scales"> = {
  "intervals":     "intervals",
  "closed-triads": "closedTriads",
  "scales":        "scales",
};

interface TrainingModeCardProps {
  option: TrainingModeOption;
  isSelected: boolean;
  onClick: (mode: TrainingMode) => void;
}

export default function TrainingModeCard({
  option,
  isSelected,
  onClick,
}: TrainingModeCardProps) {
  const accent = ACCENT_MAP[option.accentColor];
  const { t } = useLanguage();
  const modeKey = MODE_KEY_MAP[option.mode];
  const modeT = t.mainMenu.modes[modeKey];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(option.mode)}
      onKeyDown={(e) => e.key === "Enter" && onClick(option.mode)}
      className={[
        "group relative overflow-hidden flex flex-col justify-between min-h-[220px]",
        "p-6 rounded-xl cursor-pointer transition-all border",
        isSelected
          ? "bg-[#353535] border-[#9ecaff]/30"
          : `bg-[#2a2a2a] border-transparent ${accent.cardHoverBorder} hover:bg-[#353535]`,
      ].join(" ")}
    >
      {/* Content */}
      <div className="relative z-10">
        <span
          className={`material-symbols-outlined mb-4 block text-3xl ${accent.iconColor}`}
        >
          {option.icon}
        </span>
        <h4
          className="text-2xl font-bold text-[#e5e2e1] leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {modeT.title}
        </h4>
        <p className="text-[#bfc7d4] text-sm mt-2 leading-relaxed">{modeT.description}</p>
      </div>

      {/* Ghost icon (decorative background) */}
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <span
          className={`material-symbols-outlined text-[120px] ${accent.ghostIcon}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {option.icon}
        </span>
      </div>

      {/* CTA row */}
      <div
        className={`mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${accent.ctaColor}`}
      >
        {modeT.selectMode}
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </div>
  );
}
