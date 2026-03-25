export interface IntervalResult {
  symbol: string;   // e.g. "2M"
  label: string;    // e.g. "Major Second"
  correct: number;
  total: number;
}

export interface SessionSummaryData {
  correct: number;
  total: number;
  intervalResults: IntervalResult[];
}

// Accuracy ratio helpers
export function getAccuracyRatio(correct: number, total: number): number {
  if (total === 0) return 0;
  return correct / total;
}

export type ResultTone = "success" | "failure" | "partial";

export function getResultTone(correct: number, total: number): ResultTone {
  if (correct === total) return "success";
  if (correct === 0) return "failure";
  return "partial";
}
