// String names from high to low (display order top to bottom)
// NOTE: The canonical StringName type is defined in src/lib/music/intervals.ts
// These are re-exported here for component convenience.
export type { StringName } from "@/lib/music/intervals";

export type NoteState =
  | "default"    // empty cell
  | "tonic"      // blue — the root note
  | "selected"   // steel blue — user clicked
  | "correct"    // green — verified correct
  | "incorrect"; // red — verified incorrect

// Key format: `${StringName}-${fret}` e.g. "A-5"
export type FretboardNotes = Record<string, NoteState>;

export type FeedbackState = "idle" | "correct" | "incorrect";

export interface SessionStats {
  correct: number;
  total: number;
}

// Display order: low E (bottom of guitar) to high E (top)
export const STRING_NAMES = ["E6", "A", "D", "G", "B", "E1"] as const;

// Frets shown: 0 (nut) through 20
export const FRET_COUNT = 20;

// Frets with single inlay dots
export const INLAY_FRETS_SINGLE = [3, 5, 7, 9, 15, 17, 19];
// Frets with double inlay dots
export const INLAY_FRETS_DOUBLE = [12];
