export type TrainingMode = "intervals" | "closed-triads" | "scales";

// ── Intervals ─────────────────────────────────────────────────────────────────

export type IntervalSymbol =
  | "all"
  | "2m" | "2M"
  | "3m" | "3M"
  | "4J"
  | "5J"
  | "6m" | "6M"
  | "7m" | "7M"
  | "8";

export interface IntervalOption {
  value: IntervalSymbol;
  enabled: boolean;
}

export const INTERVAL_OPTIONS: IntervalOption[] = [
  { value: "all", enabled: true },
  { value: "2m",  enabled: true },
  { value: "2M",  enabled: true },
  { value: "3m",  enabled: true },
  { value: "3M",  enabled: true },
  { value: "4J",  enabled: true },
  { value: "5J",  enabled: true },
  { value: "6m",  enabled: true },
  { value: "6M",  enabled: true },
  { value: "7m",  enabled: true },
  { value: "7M",  enabled: true },
  { value: "8",   enabled: true },
];

export type QuestionCount = 10 | 25 | 50 | null; // null = infinite (∞)

// ── Triads ───────────────────────────────────────────────────────────────────

export type TriadInversion = "all" | "fundamental" | "first" | "second";
export type TriadQuality = "all" | "major" | "minor" | "sus2" | "sus4" | "diminished" | "augmented";

export interface TriadInversionOption {
  value: TriadInversion;
  enabled: boolean; // false = shown but disabled (coming soon)
}

export interface TriadQualityOption {
  value: TriadQuality;
  enabled: boolean;
}

export const TRIAD_INVERSION_OPTIONS: TriadInversionOption[] = [
  { value: "all",         enabled: true },
  { value: "fundamental", enabled: true },
  { value: "first",       enabled: true },
  { value: "second",      enabled: true },
];

export const TRIAD_QUALITY_OPTIONS: TriadQualityOption[] = [
  { value: "all",        enabled: true },
  { value: "major",      enabled: true },
  { value: "minor",      enabled: true },
  { value: "sus2",       enabled: true },
  { value: "sus4",       enabled: true },
  { value: "diminished", enabled: true },
  { value: "augmented",  enabled: true },
];

export interface TrainingModeOption {
  mode: TrainingMode;
  icon: string;
  accentColor: "primary" | "secondary" | "tertiary" | "outline";
}

export const TRAINING_MODE_OPTIONS: TrainingModeOption[] = [
  {
    mode: "intervals",
    icon: "straighten",
    accentColor: "primary",
  },
  {
    mode: "closed-triads",
    icon: "format_overline",
    accentColor: "secondary",
  },
  {
    mode: "scales",
    icon: "blur_linear",
    accentColor: "outline",
  },
];

export const QUESTION_COUNT_OPTIONS: Array<{ value: QuestionCount; label: string }> = [
  { value: 10,   label: "10" },
  { value: 25,   label: "25" },
  { value: 50,   label: "50" },
  { value: null, label: "∞" },
];
