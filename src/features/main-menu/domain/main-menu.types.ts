export type TrainingMode = "intervals" | "closed-triads" | "scales";

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
