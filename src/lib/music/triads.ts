import {
  getCumulativeOffset,
  getTargetString,
  fretToMidi,
  midiToTonicName,
  type StringName,
  type NoteName,
} from "./notes";
import type { Position } from "./intervals";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TriadQuality =
  | "major"
  | "minor"
  | "sus2"
  | "sus4"
  | "diminished"
  | "augmented";

export interface TriadQuestionData {
  kind: "triad";
  tonicString: StringName;
  tonicFret: number;
  tonicNote: NoteName;
  quality: TriadQuality;
  qualityLabel: string;
  /**
   * Only note2 (3rd) and note3 (5th).
   * The tónica is already shown in blue — the user does NOT select it.
   */
  correctPositions: Position[];
}

// ── Quality formulas ──────────────────────────────────────────────────────────

interface TriadFormula {
  label: string;
  /** Semitones above tonic for note 2 (third/sus) */
  third: number;
  /** Semitones above tonic for note 3 (fifth) */
  fifth: number;
}

const TRIAD_FORMULAS: Record<TriadQuality, TriadFormula> = {
  major:      { label: "Mayor",      third: 4, fifth: 7 },
  minor:      { label: "Menor",      third: 3, fifth: 7 },
  sus2:       { label: "Sus2",       third: 2, fifth: 7 },
  sus4:       { label: "Sus4",       third: 5, fifth: 7 },
  diminished: { label: "Disminuido", third: 3, fifth: 6 },
  augmented:  { label: "Aumentado",  third: 4, fifth: 8 },
};

const ALL_QUALITIES: TriadQuality[] = [
  "major", "minor", "sus2", "sus4", "diminished", "augmented",
];

// ── Fret constraints ──────────────────────────────────────────────────────────

/**
 * Valid tonic strings: E6 (guitar 6), A (5), D (4), G (3).
 * Each needs at least 2 adjacent strings above to place the full triad.
 */
const VALID_TONIC_STRINGS: StringName[] = ["E6", "A", "D", "G"];

const TONIC_FRET_MIN = 5;
const TONIC_FRET_MAX = 12;

// ── Core algorithm ────────────────────────────────────────────────────────────

/**
 * Compute the two non-tonic positions for a fundamental closed triad.
 *
 * The triad spans 3 consecutive strings starting at the tonic string:
 *   string1 (tonic) — string2 (third) — string3 (fifth)
 *
 * Fret formula:
 *   fret_2 = tonicFret + third_semitones  − cumulativeOffset(tonicString, 1)
 *   fret_3 = tonicFret + fifth_semitones  − cumulativeOffset(tonicString, 2)
 *
 * Returns null if either fret falls outside [0, 20].
 */
export function getTriadPositions(
  tonicString: StringName,
  tonicFret: number,
  quality: TriadQuality,
): Position[] | null {
  const formula  = TRIAD_FORMULAS[quality];
  const string2  = getTargetString(tonicString, 1);
  const string3  = getTargetString(tonicString, 2);
  if (!string2 || !string3) return null;

  const offset1 = getCumulativeOffset(tonicString, 1);
  const offset2 = getCumulativeOffset(tonicString, 2);

  const fret2 = tonicFret + formula.third - offset1;
  const fret3 = tonicFret + formula.fifth - offset2;

  if (fret2 < 0 || fret2 > 20 || fret3 < 0 || fret3 > 20) return null;

  return [
    { string: string2, fret: fret2 },
    { string: string3, fret: fret3 },
  ];
}

// ── Question generation ───────────────────────────────────────────────────────

/** Generate a random fundamental closed-triad question. */
export function generateTriadQuestion(): TriadQuestionData {
  const MAX_ATTEMPTS = 200;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const quality = ALL_QUALITIES[Math.floor(Math.random() * ALL_QUALITIES.length)];
    const tonicString = VALID_TONIC_STRINGS[
      Math.floor(Math.random() * VALID_TONIC_STRINGS.length)
    ];
    const tonicFret =
      TONIC_FRET_MIN +
      Math.floor(Math.random() * (TONIC_FRET_MAX - TONIC_FRET_MIN + 1));

    const correctPositions = getTriadPositions(tonicString, tonicFret, quality);
    if (!correctPositions) continue;

    const tonicMidi = fretToMidi(tonicString, tonicFret);
    const tonicNote = midiToTonicName(tonicMidi) as NoteName;

    return {
      kind: "triad",
      tonicString,
      tonicFret,
      tonicNote,
      quality,
      qualityLabel: TRIAD_FORMULAS[quality].label,
      correctPositions,
    };
  }

  throw new Error("Could not generate a valid triad question after many attempts");
}

// ── Re-exports ────────────────────────────────────────────────────────────────
export type { Position, StringName, NoteName };
