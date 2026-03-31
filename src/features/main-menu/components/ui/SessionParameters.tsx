import type { QuestionCount, TrainingMode, TriadInversion, TriadQuality } from "../../domain/main-menu.types";
import {
  QUESTION_COUNT_OPTIONS,
  TRIAD_INVERSION_OPTIONS,
  TRIAD_QUALITY_OPTIONS,
} from "../../domain/main-menu.types";

interface SessionParametersProps {
  selectedCount:    QuestionCount;
  onSelectCount:    (count: QuestionCount) => void;
  selectedMode:     TrainingMode;
  selectedInversion: TriadInversion;
  onSelectInversion: (inv: TriadInversion) => void;
  selectedQuality:  TriadQuality;
  onSelectQuality:  (q: TriadQuality) => void;
  onStart:          () => void;
}

const isTriadMode = (mode: TrainingMode) =>
  mode === "closed-triads";

export default function SessionParameters({
  selectedCount,
  onSelectCount,
  selectedMode,
  selectedInversion,
  onSelectInversion,
  selectedQuality,
  onSelectQuality,
  onStart,
}: SessionParametersProps) {
  const showTriadFilters = isTriadMode(selectedMode);

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

      {/* ── Triad filters (only visible for triad modes) ── */}
      <div
        className={[
          "space-y-4 overflow-hidden transition-all duration-300 ease-in-out",
          showTriadFilters
            ? "max-h-[240px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* Inversion selector */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-[#89919d]">
            Inversión
          </label>
          <div className="relative">
            <select
              value={selectedInversion}
              onChange={(e) => onSelectInversion(e.target.value as TriadInversion)}
              className={[
                "w-full appearance-none rounded-md px-4 py-3 pr-10 text-sm font-medium",
                "bg-[#0e0e0e] border border-[#353535] text-[#e5e2e1]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ecaff]/40",
                "transition-colors cursor-pointer",
              ].join(" ")}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {TRIAD_INVERSION_OPTIONS.map(({ value, label, enabled }) => (
                <option
                  key={value}
                  value={value}
                  disabled={!enabled}
                  style={{
                    color: enabled ? "#e5e2e1" : "#4a5260",
                    backgroundColor: "#0e0e0e",
                    fontStyle: enabled ? "normal" : "italic",
                  }}
                >
                  {enabled ? label : `${label} — próximamente`}
                </option>
              ))}
            </select>
            {/* Chevron icon */}
            <span
              className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#89919d] text-base"
              aria-hidden="true"
            >
              expand_more
            </span>
          </div>
        </div>

        {/* Quality selector */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-[#89919d]">
            Calidad
          </label>
          <div className="relative">
            <select
              value={selectedQuality}
              onChange={(e) => onSelectQuality(e.target.value as TriadQuality)}
              className={[
                "w-full appearance-none rounded-md px-4 py-3 pr-10 text-sm font-medium",
                "bg-[#0e0e0e] border border-[#353535] text-[#e5e2e1]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ecaff]/40",
                "transition-colors cursor-pointer",
              ].join(" ")}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {TRIAD_QUALITY_OPTIONS.map(({ value, label }) => (
                <option
                  key={value}
                  value={value}
                  style={{
                    color: "#e5e2e1",
                    backgroundColor: "#0e0e0e",
                  }}
                >
                  {label}
                </option>
              ))}
            </select>
            {/* Chevron icon */}
            <span
              className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#89919d] text-base"
              aria-hidden="true"
            >
              expand_more
            </span>
          </div>
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
