export type TrainingMode = "intervals" | "closed-triads" | "scales";

export type QuestionCount = 10 | 25 | 50 | null; // null = infinite (∞)

// ── Triads ───────────────────────────────────────────────────────────────────

export type TriadInversion = "all" | "fundamental" | "first" | "second";
export type TriadQuality = "all" | "major" | "minor" | "sus2" | "sus4" | "diminished" | "augmented";

export interface TriadInversionOption {
  value: TriadInversion;
  label: string;
  enabled: boolean; // false = shown but disabled (coming soon)
}

export interface TriadQualityOption {
  value: TriadQuality;
  label: string;
  enabled: boolean;
}

export const TRIAD_INVERSION_OPTIONS: TriadInversionOption[] = [
  { value: "all",         label: "Todas",         enabled: true },
  { value: "fundamental", label: "Fundamental",   enabled: true },
  { value: "first",       label: "1ra Inversión", enabled: true },
  { value: "second",      label: "2da Inversión", enabled: true },
];

export const TRIAD_QUALITY_OPTIONS: TriadQualityOption[] = [
  { value: "all", label: "Todas", enabled: true },
  { value: "major", label: "Mayor", enabled: true },
  { value: "minor", label: "Menor", enabled: true },
  { value: "sus2", label: "Sus2", enabled: true },
  { value: "sus4", label: "Sus4", enabled: true },
  { value: "diminished", label: "Disminuido", enabled: true },
  { value: "augmented", label: "Aumentado", enabled: true },
];

export interface TrainingModeOption {
  mode: TrainingMode;
  icon: string;
  title: string;
  description: string;
  accentColor: "primary" | "secondary" | "tertiary" | "outline";
}

export const TRAINING_MODE_OPTIONS: TrainingModeOption[] = [
  {
    mode: "intervals",
    icon: "straighten",
    title: "Intervals",
    description: "Identify distances between notes across all strings.",
    accentColor: "primary",
  },
  {
    mode: "closed-triads",
    icon: "format_overline",
    title: "Closed Triads",
    description: "Standard major, minor, diminished, and augmented shapes.",
    accentColor: "secondary",
  },
  {
    mode: "scales",
    icon: "blur_linear",
    title: "Scales",
    description: "Diatonic, Pentatonic, and Harmonic patterns.",
    accentColor: "outline",
  },
];

export const QUESTION_COUNT_OPTIONS: Array<{ value: QuestionCount; label: string }> = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: null, label: "∞" },
];
