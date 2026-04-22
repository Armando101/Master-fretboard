import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type {
  QuestionCount,
  TrainingMode,
  TriadInversion,
  TriadQuality,
  IntervalSymbol,
} from "../../domain/main-menu.types";
import {
  QUESTION_COUNT_OPTIONS,
  TRIAD_INVERSION_OPTIONS,
  TRIAD_QUALITY_OPTIONS,
  INTERVAL_OPTIONS,
} from "../../domain/main-menu.types";
import type { Translations } from "@/i18n";

interface SessionParametersProps {
  selectedCount:       QuestionCount;
  onSelectCount:       (count: QuestionCount) => void;
  selectedMode:        TrainingMode;
  selectedInversions:  TriadInversion[];
  onSelectInversions:  (inv: TriadInversion[]) => void;
  selectedQualities:   TriadQuality[];
  onSelectQualities:   (q: TriadQuality[]) => void;
  selectedIntervals:   IntervalSymbol[];
  onSelectIntervals:   (s: IntervalSymbol[]) => void;
  useMic:              boolean;
  onToggleMic:         (val: boolean) => void;
  onStart:             () => void;
}

const isTriadMode     = (mode: TrainingMode) => mode === "closed-triads";
const isIntervalMode  = (mode: TrainingMode) => mode === "intervals";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ── Typed option shapes (no label baked in) ───────────────────────────────────
type InversionOptionWithLabel = { value: TriadInversion;  label: string; enabled?: boolean };
type QualityOptionWithLabel   = { value: TriadQuality;    label: string; enabled?: boolean };
type IntervalOptionWithLabel  = { value: IntervalSymbol;  label: string; enabled?: boolean };

function MultiSelectDropdown<T extends string>({
  options,
  selectedValues,
  onChange,
  placeholder,
  allLabel,
}: {
  options: { value: T; label: string; enabled?: boolean }[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
  placeholder: string;
  allLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const enabledOptions = options.filter(o => o.value !== "all" && (o.enabled !== false));
  const allValues = enabledOptions.map(o => o.value);
  const isAllSelected = allValues.length > 0 && allValues.every(v => selectedValues.includes(v));

  const handleToggle = (optionValue: T) => {
    if (optionValue === ("all" as T)) {
      if (isAllSelected) {
        onChange([]);
      } else {
        onChange(allValues);
      }
      return;
    }

    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter(v => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  const displayText = selectedValues.length === 0
    ? placeholder
    : isAllSelected
      ? allLabel
      : selectedValues.map(v => options.find(o => o.value === v)?.label).filter(Boolean).join(", ");

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "w-full rounded-md px-4 py-3 pr-10 text-sm font-medium text-left truncate flex items-center justify-between",
          "bg-[#0e0e0e] border text-[#e5e2e1]",
          isOpen ? "border-[#9ecaff]/50 ring-2 ring-[#9ecaff]/20" : "border-[#353535]",
          "transition-all cursor-pointer",
        ].join(" ")}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <span className="truncate pr-4">{displayText}</span>
        <span className="material-symbols-outlined absolute right-3 text-[#89919d] text-base">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#1c1b1b] border border-[#353535] rounded-md shadow-lg z-50 p-2 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isAllOption = option.value === "all";
            const isChecked = isAllOption ? isAllSelected : selectedValues.includes(option.value);
            const isDisabled = option.enabled === false;

            return (
              <label
                key={option.value}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                  isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#353535]"
                ].join(" ")}
              >
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#89919d] bg-[#0e0e0e] flex-shrink-0">
                  <input
                    type="checkbox"
                    className="appearance-none absolute inset-0 cursor-pointer disabled:cursor-not-allowed"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleToggle(option.value)}
                  />
                  {isChecked && (
                    <span className="material-symbols-outlined text-[#9ecaff] text-sm font-bold pointer-events-none">
                      check
                    </span>
                  )}
                </div>
                <span className="text-sm text-[#e5e2e1]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Helpers: map domain values → translated label options ─────────────────────

function buildInversionOptions(
  t: Translations["mainMenu"]["triadInversions"],
  comingSoon: string,
): InversionOptionWithLabel[] {
  return TRIAD_INVERSION_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.enabled
      ? t[opt.value]
      : `${t[opt.value]} — ${comingSoon}`,
    enabled: opt.enabled,
  }));
}

function buildQualityOptions(
  t: Translations["mainMenu"]["triadQualities"],
  comingSoon: string,
): QualityOptionWithLabel[] {
  return TRIAD_QUALITY_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.enabled
      ? t[opt.value]
      : `${opt.value} — ${comingSoon}`,
    enabled: opt.enabled,
  }));
}

function buildIntervalOptions(
  intervalLabels: Translations["trainer"]["intervalLabels"],
  allLabel: string,
): IntervalOptionWithLabel[] {
  return INTERVAL_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.value === "all" ? allLabel : intervalLabels[opt.value as keyof typeof intervalLabels] ?? opt.value,
    enabled: opt.enabled,
  }));
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SessionParameters({
  selectedCount,
  onSelectCount,
  selectedMode,
  selectedInversions,
  onSelectInversions,
  selectedQualities,
  onSelectQualities,
  selectedIntervals,
  onSelectIntervals,
  useMic,
  onToggleMic,
  onStart,
}: SessionParametersProps) {
  const { t } = useLanguage();
  const sp = t.mainMenu.sessionParams;
  const showTriadFilters    = isTriadMode(selectedMode);
  const showIntervalFilters = isIntervalMode(selectedMode);

  const isStartDisabled =
    (showTriadFilters    && (selectedInversions.length === 0 || selectedQualities.length === 0)) ||
    (showIntervalFilters && selectedIntervals.length === 0);

  const inversionOptions = buildInversionOptions(t.mainMenu.triadInversions, sp.comingSoon);
  const qualityOptions   = buildQualityOptions(t.mainMenu.triadQualities, sp.comingSoon);
  const intervalOptions  = buildIntervalOptions(t.trainer.intervalLabels, sp.allLabel);

  return (
    <div className="bg-[#1c1b1b] p-8 rounded-xl space-y-6">
      <h3
        className="text-lg font-semibold text-[#e5e2e1]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {sp.title}
      </h3>

      {/* Question count selector */}
      <div className="space-y-4">
        <label className="block text-xs uppercase tracking-widest text-[#89919d]">
          {sp.numberOfQuestions}
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

      {/* ── Interval filter (only visible for intervals mode) ── */}
      <div
        className={[
          "space-y-4 transition-all duration-300 ease-in-out",
          showIntervalFilters
            ? "max-h-[160px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none overflow-hidden",
        ].join(" ")}
      >
        <div className="space-y-2 relative z-10">
          <label className="block text-xs uppercase tracking-widest text-[#89919d]">
            {sp.intervalFilter}
          </label>
          <MultiSelectDropdown<IntervalSymbol>
            options={intervalOptions}
            selectedValues={selectedIntervals}
            onChange={onSelectIntervals}
            placeholder={sp.selectInterval}
            allLabel={sp.allLabel}
          />
        </div>
      </div>

      {/* ── Triad filters (only visible for triad modes) ── */}
      <div
        className={[
          "space-y-4 transition-all duration-300 ease-in-out",
          showTriadFilters
            ? "max-h-[240px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none overflow-hidden",
        ].join(" ")}
      >
        {/* Inversion selector */}
        <div className="space-y-2 relative z-10">
          <label className="block text-xs uppercase tracking-widest text-[#89919d]">
            {sp.inversion}
          </label>
          <MultiSelectDropdown<TriadInversion>
            options={inversionOptions}
            selectedValues={selectedInversions}
            onChange={onSelectInversions}
            placeholder={sp.selectInversion}
            allLabel={sp.allLabel}
          />
        </div>

        {/* Quality selector */}
        <div className="space-y-2 relative z-0">
          <label className="block text-xs uppercase tracking-widest text-[#89919d]">
            {sp.quality}
          </label>
          <MultiSelectDropdown<TriadQuality>
            options={qualityOptions}
            selectedValues={selectedQualities}
            onChange={onSelectQualities}
            placeholder={sp.selectQuality}
            allLabel={sp.allLabel}
          />
        </div>
      </div>

      {/* ── Microphone Toggle ── */}
      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-widest text-[#89919d]">
          Entrada
        </label>
        <button
          type="button"
          onClick={() => onToggleMic(!useMic)}
          className={[
            "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-md border transition-all",
            useMic
              ? "bg-[#ffb74d]/10 border-[#ffb74d]/40 text-[#ffb74d]"
              : "bg-[#0e0e0e] border-[#353535] text-[#bfc7d4] hover:border-[#9ecaff]/30",
          ].join(" ")}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              {useMic ? "mic" : "mic_off"}
            </span>
            <span className="text-sm font-medium">
              {useMic ? "Micrófono activado" : "Solo pantalla"}
            </span>
          </div>
          {/* Toggle pill */}
          <div
            className={[
              "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
              useMic ? "bg-[#ffb74d]" : "bg-[#353535]",
            ].join(" ")}
          >
            <div
              className={[
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                useMic ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </div>
        </button>

        {/* Tuning tip — shown only when mic is active */}
        {useMic && (
          <p className="text-xs text-[#89919d] leading-relaxed flex items-start gap-1.5">
            <span className="material-symbols-outlined text-[#ffb74d] text-sm mt-0.5">info</span>
            Para una mejor experiencia, afina tu guitarra antes de comenzar.
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        disabled={isStartDisabled}
        className={[
          "w-full py-4 rounded-md font-bold transition-all",
          isStartDisabled
            ? "bg-[#2a2a2a] text-[#89919d] cursor-not-allowed"
            : "cta-gradient text-[#002c4f] shadow-cta active:scale-95 hover:opacity-90",
        ].join(" ")}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {sp.start}
      </button>
    </div>
  );
}
