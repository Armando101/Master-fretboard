import type { QuestionCount } from "../../domain/main-menu.types";
import { QUESTION_COUNT_OPTIONS } from "../../domain/main-menu.types";

interface SessionParametersProps {
  selectedCount: QuestionCount;
  onSelectCount: (count: QuestionCount) => void;
  onStart: () => void;
}

export default function SessionParameters({
  selectedCount,
  onSelectCount,
  onStart,
}: SessionParametersProps) {
  return (
    <div className="bg-[#1c1b1b] p-8 rounded-xl space-y-6">
      <h3
        className="text-lg font-semibold text-[#e5e2e1]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Session Parameters
      </h3>

      {/* Question count selector */}
      <div className="space-y-4">
        <label className="block text-xs uppercase tracking-widest text-[#89919d]">
          Number of Questions
        </label>
        <div className="flex gap-3">
          {QUESTION_COUNT_OPTIONS.map(({ value, label }) => {
            const isActive = selectedCount === value;
            return (
              <button
                key={label}
                onClick={() => onSelectCount(value)}
                className={[
                  "flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ecaff]/50",
                  isActive
                    ? "bg-[#353535] text-[#9ecaff] border border-[#9ecaff]/20"
                    : "bg-[#0e0e0e] text-[#bfc7d4] hover:bg-[#353535]",
                ].join(" ")}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full cta-gradient py-4 rounded-md font-bold text-[#002c4f] shadow-cta active:scale-95 transition-all hover:opacity-90"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Comenzar
      </button>
    </div>
  );
}
