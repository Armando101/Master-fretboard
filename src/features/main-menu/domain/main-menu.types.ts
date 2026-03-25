export type TrainingMode = "intervals" | "closed-triads" | "inversions" | "scales";

export type QuestionCount = 10 | 25 | 50 | null; // null = infinite (∞)

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
    mode: "inversions",
    icon: "rebase_edit",
    title: "Closed Triads — Inversions",
    description: "Master root, 1st, and 2nd inversions across the neck.",
    accentColor: "tertiary",
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
  { value: 10,   label: "10" },
  { value: 25,   label: "25" },
  { value: 50,   label: "50" },
  { value: null, label: "∞" },
];
