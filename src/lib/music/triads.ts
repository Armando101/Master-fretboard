import {
  getTargetString,
  fretToMidi,
  midiToTonicName,
  STRING_OPEN_MIDI,
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

/** Music-domain inversion type — does NOT include "all" (that is a UI-only concept). */
export type TriadInversion = "fundamental" | "first" | "second";

export interface TriadQuestionData {
  kind: "triad";
  inversion: TriadInversion;
  inversionLabel: string;
  tonicString: StringName;
  tonicFret: number;
  tonicNote: NoteName;
  quality: TriadQuality;
  qualityLabel: string;
  /**
   * The two non-tonic positions the user must select.
   * The tónica is already displayed in blue — the user does NOT select it.
   */
  correctPositions: Position[];
}

// ── Quality formulas ──────────────────────────────────────────────────────────

interface TriadFormula {
  label: string;
  /** Semitones above tonic for the third (or sus interval) */
  third: number;
  /** Semitones above tonic for the fifth */
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

const ALL_INVERSIONS: TriadInversion[] = ["fundamental", "first", "second"];

const INVERSION_LABELS: Record<TriadInversion, string> = {
  fundamental: "Fundamental",
  first:       "1ra Inversión",
  second:      "2da Inversión",
};

// ── Per-inversion constraints ─────────────────────────────────────────────────

interface InversionConfig {
  /** Valid tonic strings for this inversion */
  tonicStrings: StringName[];
  tonicFretMin: number;
  tonicFretMax: number;
  getPositions: (
    tonicString: StringName,
    tonicFret: number,
    quality: TriadQuality,
  ) => Position[] | null;
}

// ── Core position calculators ─────────────────────────────────────────────────

/**
 * Fundamental: tonic is the lowest (bass) string.
 *   - 3rd on tonicString + 1
 *   - 5th on tonicString + 2
 *
 * Fret formula (via MIDI arithmetic, identical to cumulative-offset approach):
 *   fret = tonicMidi + interval - STRING_OPEN_MIDI[targetString]
 */
function getFundamentalPositions(
  tonicString: StringName,
  tonicFret: number,
  quality: TriadQuality,
): Position[] | null {
  const formula   = TRIAD_FORMULAS[quality];
  const strThird  = getTargetString(tonicString, 1);
  const strFifth  = getTargetString(tonicString, 2);
  if (!strThird || !strFifth) return null;

  const tonicMidi = fretToMidi(tonicString, tonicFret);
  const fretThird = tonicMidi + formula.third - STRING_OPEN_MIDI[strThird];
  const fretFifth = tonicMidi + formula.fifth - STRING_OPEN_MIDI[strFifth];

  if (fretThird < 0 || fretThird > 20 || fretFifth < 0 || fretFifth > 20) return null;

  return [
    { string: strThird, fret: fretThird },
    { string: strFifth, fret: fretFifth },
  ];
}

/**
 * 1st Inversion: tonic is the highest (treble) string.
 *   - 3rd → 2 strings BELOW tonic, one octave down: tonicMidi + third - 12
 *   - 5th → 1 string  BELOW tonic, one octave down: tonicMidi + fifth  - 12
 *
 * Example (A, fret 7, D-string):
 *   3rd C# → E6 string, fret 9   (MIDI 49 = 57 + 4 − 12, fret = 49 − 40)
 *   5th E  → A  string, fret 7   (MIDI 52 = 57 + 7 − 12, fret = 52 − 45)
 */
function getFirstInversionPositions(
  tonicString: StringName,
  tonicFret: number,
  quality: TriadQuality,
): Position[] | null {
  const formula   = TRIAD_FORMULAS[quality];
  const strFifth  = getTargetString(tonicString, -1); // 1 string below
  const strThird  = getTargetString(tonicString, -2); // 2 strings below
  if (!strFifth || !strThird) return null;

  const tonicMidi = fretToMidi(tonicString, tonicFret);
  const fretThird = tonicMidi + formula.third - 12 - STRING_OPEN_MIDI[strThird];
  const fretFifth = tonicMidi + formula.fifth - 12 - STRING_OPEN_MIDI[strFifth];

  if (fretThird < 0 || fretThird > 20 || fretFifth < 0 || fretFifth > 20) return null;

  return [
    { string: strThird, fret: fretThird },
    { string: strFifth, fret: fretFifth },
  ];
}

/**
 * 2nd Inversion: tonic is the middle string.
 *   - 5th → 1 string BELOW tonic, one octave down: tonicMidi + fifth - 12
 *   - 3rd → 1 string ABOVE tonic, same octave:      tonicMidi + third
 *
 * Example (A, fret 12, A-string):
 *   5th E  → E6 string, fret 12  (MIDI 52 = 57 + 7 − 12, fret = 52 − 40)
 *   3rd C# → D  string, fret 11  (MIDI 61 = 57 + 4,       fret = 61 − 50)
 */
function getSecondInversionPositions(
  tonicString: StringName,
  tonicFret: number,
  quality: TriadQuality,
): Position[] | null {
  const formula   = TRIAD_FORMULAS[quality];
  const strFifth  = getTargetString(tonicString, -1); // 1 string below
  const strThird  = getTargetString(tonicString,  1); // 1 string above
  if (!strFifth || !strThird) return null;

  const tonicMidi = fretToMidi(tonicString, tonicFret);
  const fretFifth = tonicMidi + formula.fifth - 12 - STRING_OPEN_MIDI[strFifth];
  const fretThird = tonicMidi + formula.third      - STRING_OPEN_MIDI[strThird];

  if (fretFifth < 0 || fretFifth > 20 || fretThird < 0 || fretThird > 20) return null;

  return [
    { string: strFifth, fret: fretFifth },
    { string: strThird, fret: fretThird },
  ];
}

// ── Inversion configs ─────────────────────────────────────────────────────────

const INVERSION_CONFIGS: Record<TriadInversion, InversionConfig> = {
  fundamental: {
    tonicStrings: ["E6", "A", "D", "G"],
    tonicFretMin: 5,
    tonicFretMax: 12,
    getPositions: getFundamentalPositions,
  },
  first: {
    /** Tonic is the treble string; needs 2 strings below → D, G, B, E1 */
    tonicStrings: ["D", "G", "B", "E1"],
    tonicFretMin: 2,
    tonicFretMax: 12,
    getPositions: getFirstInversionPositions,
  },
  second: {
    /** Tonic is the middle string; needs 1 string below and 1 above → A, D, G, B */
    tonicStrings: ["A", "D", "G", "B"],
    tonicFretMin: 4,
    tonicFretMax: 12,
    getPositions: getSecondInversionPositions,
  },
};

// ── Question generation ───────────────────────────────────────────────────────

export function generateTriadQuestion(
  allowedQualities?: TriadQuality[],
  allowedInversions?: TriadInversion[],
): TriadQuestionData {
  const MAX_ATTEMPTS = 400;
  const qualities   = allowedQualities?.length  ? allowedQualities  : ALL_QUALITIES;
  const inversions  = allowedInversions?.length ? allowedInversions : ALL_INVERSIONS;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const inversion  = inversions[Math.floor(Math.random() * inversions.length)];
    const quality    = qualities[Math.floor(Math.random() * qualities.length)];
    const cfg        = INVERSION_CONFIGS[inversion];

    const tonicString = cfg.tonicStrings[
      Math.floor(Math.random() * cfg.tonicStrings.length)
    ];
    const tonicFret =
      cfg.tonicFretMin +
      Math.floor(Math.random() * (cfg.tonicFretMax - cfg.tonicFretMin + 1));

    const correctPositions = cfg.getPositions(tonicString, tonicFret, quality);
    if (!correctPositions) continue;

    const tonicMidi = fretToMidi(tonicString, tonicFret);
    const tonicNote = midiToTonicName(tonicMidi) as NoteName;

    return {
      kind: "triad",
      inversion,
      inversionLabel: INVERSION_LABELS[inversion],
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
