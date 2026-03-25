// String names from high to low (display order top to bottom = string 1 to 6)
export type StringName = "E1" | "B" | "G" | "D" | "A" | "E6";

export type NoteState =
  | "default"    // empty, non-interactive display
  | "tonic"      // purple – the root note shown to the user
  | "selected"   // blue  – user clicked this note
  | "correct"    // green – verified as correct
  | "incorrect"; // red   – verified as incorrect

// Key format: `${StringName}-${fret}`  e.g. "A-5"
export type FretboardNotes = Record<string, NoteState>;

export type FeedbackState = "idle" | "correct" | "incorrect";

export interface SessionStats {
  correct: number;
  total: number;
}

// The 6 open strings in standard tuning (low to high for display)
export const STRING_NAMES: StringName[] = ["E6", "A", "D", "G", "B", "E1"];

// Frets shown: 0 (nut) through 12
export const FRET_COUNT = 12;

// Frets that have inlay dots
export const INLAY_FRETS_SINGLE = [3, 5, 7, 9];
export const INLAY_FRET_DOUBLE = 12;
