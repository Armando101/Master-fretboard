// ── Chromatic scale (sharps only — used for raw MIDI lookup) ──────────────────
const CHROMATIC_SHARPS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

// ── Extended note name type (includes flats) ──────────────────────────────────
export type NoteName =
  | "C" | "C#" | "Db" | "D" | "D#" | "Eb" | "E" | "E#" | "Fb"
  | "F" | "F#" | "Gb" | "G" | "G#" | "Ab" | "A" | "A#" | "Bb"
  | "B" | "B#" | "Cb";

// ── The 15 major scales with correct enharmonic note names ────────────────────
// Each array: [I, II, III, IV, V, VI, VII] — 7 distinct pitch classes
const MAJOR_SCALES: Record<string, readonly string[]> = {
  C:  ["C",  "D",  "E",  "F",  "G",  "A",  "B" ],
  G:  ["G",  "A",  "B",  "C",  "D",  "E",  "F#"],
  D:  ["D",  "E",  "F#", "G",  "A",  "B",  "C#"],
  A:  ["A",  "B",  "C#", "D",  "E",  "F#", "G#"],
  E:  ["E",  "F#", "G#", "A",  "B",  "C#", "D#"],
  B:  ["B",  "C#", "D#", "E",  "F#", "G#", "A#"],
  "F#": ["F#", "G#", "A#", "B",  "C#", "D#", "E#"],
  "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
  F:  ["F",  "G",  "A",  "Bb", "C",  "D",  "E" ],
  Bb: ["Bb", "C",  "D",  "Eb", "F",  "G",  "A" ],
  Eb: ["Eb", "F",  "G",  "Ab", "Bb", "C",  "D" ],
  Ab: ["Ab", "Bb", "C",  "Db", "Eb", "F",  "G" ],
  Db: ["Db", "Eb", "F",  "Gb", "Ab", "Bb", "C" ],
  Gb: ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F" ],
  Cb: ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
};

// ── Map from note name → MIDI pitch class (0–11) ──────────────────────────────
const NOTE_TO_PC: Record<string, number> = {
  "Cb": 11, "C": 0,  "C#": 1,  "Db": 1,
  "D": 2,   "D#": 3, "Eb": 3,
  "E": 4,   "E#": 5, "Fb": 4,
  "F": 5,   "F#": 6, "Gb": 6,
  "G": 7,   "G#": 8, "Ab": 8,
  "A": 9,   "A#": 10,"Bb": 10,
  "B": 11,  "B#": 0,
};

/**
 * Build a lookup table: tonicName → Map<pitchClass, properNoteName>
 * This tells us, for any tonic, how each of the 7 pitch classes in that key
 * should be spelled.
 */
const SCALE_PC_TO_NAME: Record<string, Map<number, string>> = {};

for (const [tonic, scale] of Object.entries(MAJOR_SCALES)) {
  const map = new Map<number, string>();
  for (const note of scale) {
    const pc = NOTE_TO_PC[note];
    if (pc !== undefined) map.set(pc, note);
  }
  SCALE_PC_TO_NAME[tonic] = map;
}

// ── The 15 valid tonics (by their canonical note name) ────────────────────────
export const VALID_TONICS = Object.keys(MAJOR_SCALES) as (keyof typeof MAJOR_SCALES)[];

// ── Standard tuning: MIDI number of each open string ─────────────────────────
// Guitar strings in ascending pitch order (low E6 → high E1)
// MIDI 40 = E2 (low E on guitar)
export const STRING_ORDER = ["E6", "A", "D", "G", "B", "E1"] as const;
export type StringName = (typeof STRING_ORDER)[number];

/** MIDI pitch of each open string (standard tuning) */
export const STRING_OPEN_MIDI: Record<StringName, number> = {
  E6: 40, // E2
  A:  45, // A2
  D:  50, // D3
  G:  55, // G3
  B:  59, // B3
  E1: 64, // E4
};

/** Semitone gap between consecutive strings (E6→A, A→D, D→G, G→B, B→E1) */
export const STRING_GAPS = [5, 5, 5, 4, 5] as const;

/** Cumulative semitone offset when jumping N strings up from a given string */
export function getCumulativeOffset(fromString: StringName, jumps: number): number {
  const fromIdx = STRING_ORDER.indexOf(fromString);
  let offset = 0;
  for (let i = fromIdx; i < fromIdx + jumps && i < STRING_GAPS.length; i++) {
    offset += STRING_GAPS[i];
  }
  return offset;
}

/** Return the string that is `jumps` strings higher in pitch, or null if out of range */
export function getTargetString(fromString: StringName, jumps: number): StringName | null {
  const idx = STRING_ORDER.indexOf(fromString) + jumps;
  if (idx < 0 || idx >= STRING_ORDER.length) return null;
  return STRING_ORDER[idx];
}

/** Compute MIDI pitch for a given string + fret */
export function fretToMidi(string: StringName, fret: number): number {
  return STRING_OPEN_MIDI[string] + fret;
}

/**
 * Return the note name for a MIDI pitch.
 *
 * When `tonicName` is provided, the name is resolved from the major scale
 * that starts on that tonic — ensuring proper enharmonic spelling
 * (e.g. Bb instead of A#, Db instead of C#).
 *
 * If the pitch class is not found in that scale (which can happen for
 * chromatic/non-diatonic notes), falls back to the sharp spelling.
 */
export function midiToName(midi: number, tonicName?: string): NoteName {
  const pc = ((midi % 12) + 12) % 12;

  if (tonicName && SCALE_PC_TO_NAME[tonicName]) {
    const name = SCALE_PC_TO_NAME[tonicName].get(pc);
    if (name) return name as NoteName;
  }

  // Fallback: sharp spelling
  return CHROMATIC_SHARPS[pc] as NoteName;
}

/**
 * Given a MIDI pitch, return the canonical tonic name that matches
 * one of the 15 major scales. Used so the tonic note is always spelled
 * correctly (e.g. Bb not A#, Db not C#).
 *
 * Returns the sharp name if no matching tonic is found (shouldn't happen).
 */
export function midiToTonicName(midi: number): string {
  const pc = ((midi % 12) + 12) % 12;

  // Find a valid tonic whose pitch class matches
  const match = VALID_TONICS.find((t) => {
    const tonicPc = NOTE_TO_PC[t];
    return tonicPc === pc;
  });

  return match ?? CHROMATIC_SHARPS[pc];
}

// ── Interval-aware enharmonic resolution ─────────────────────────────────────

/**
 * Maps each interval symbol to the 0-based index of the major-scale degree
 * that defines its letter name:
 *   2nd → index 1, 3rd → index 2, 4th → index 3,
 *   5th → index 4, 6th → index 5, 7th → index 6, 8va → index 0
 */
const INTERVAL_DEGREE_IDX: Record<string, number> = {
  "2m": 1, "2M": 1,
  "3m": 2, "3M": 2,
  "4J": 3, "4A": 3,          // augmented 4th → 4th degree sharped
  "5d": 4, "5J": 4, "5A": 4, // dim/perfect/aug 5th → 5th degree (flat/natural/sharp)
  "6m": 5, "6M": 5,
  "7m": 6, "7M": 6,
  "8":  0,
};

/**
 * Resolve the correct enharmonic spelling for an interval note using the
 * degree implied by the interval symbol.
 *
 * Examples:
 *  - 6m of G  → degree 6 = E, lower by 1 → Eb  (not D#)
 *  - 2m of C  → degree 2 = D, lower by 1 → Db  (not C#)
 *  - 5# of G  → degree 5 = D, raise by 1 → D#  (not Eb)
 *
 * Falls back to midiToName when the symbol or tonic is unrecognised.
 */
export function resolveIntervalNoteName(
  midi: number,
  tonicName: string,
  intervalSymbol: string,
): string {
  const pc = ((midi % 12) + 12) % 12;

  // Fast path: diatonic note → already correct in the scale map
  const scaleMap = SCALE_PC_TO_NAME[tonicName];
  if (scaleMap?.has(pc)) return scaleMap.get(pc)!;

  // Chromatic note: derive letter from scale degree, then apply alteration
  const degIdx = INTERVAL_DEGREE_IDX[intervalSymbol];
  const scale  = MAJOR_SCALES[tonicName];
  if (degIdx === undefined || !scale) return midiToName(midi, tonicName) as string;

  const diatonicNote = scale[degIdx];          // e.g. "E", "G#", "Bb"
  const letter       = diatonicNote[0];         // "E", "G", "B"
  const diatonicPc   = NOTE_TO_PC[diatonicNote];
  
  let shift = ((pc - diatonicPc) % 12 + 12) % 12;
  if (shift > 6) shift -= 12; // Normalize to -6..+5 range

  const accidental = diatonicNote.substring(1);
  let accValue = 0;
  if (accidental === "#") accValue = 1;
  else if (accidental === "b") accValue = -1;

  const totalAcc = accValue + shift;

  let newAccStr = "";
  if (totalAcc === -2) newAccStr = "bb";
  else if (totalAcc === -1) newAccStr = "b";
  else if (totalAcc === 0) newAccStr = "";
  else if (totalAcc === 1) newAccStr = "#";
  else if (totalAcc === 2) newAccStr = "x";
  else return midiToName(midi) as string; // unexpected, fallback

  return `${letter}${newAccStr}`;
}
