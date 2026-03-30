import {
  STRING_ORDER,
  STRING_OPEN_MIDI,
  fretToMidi,
  midiToTonicName,
  type StringName,
  type NoteName,
} from "./notes";
import type { Position } from "./intervals";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ScalePosition = "Derecha" | "Centro" | "Izquierda";
export type ScaleScope    = "1-8va"   | "all-strings";

export interface ScaleQuestionData {
  kind: "scale";
  tonicString: StringName;
  tonicFret: number;
  tonicNote: NoteName;
  position: ScalePosition;
  positionLabel: string;   // same as position, kept for display symmetry
  scope: ScaleScope;
  scopeLabel: string;      // "1 Octava" | "Cuerdas Restantes"
  correctPositions: Position[];
}

// ── Major scale extended semitone series ──────────────────────────────────────
// Degrees 1–18 (covers up to 3 strings at 3 notes each × 6 strings).
// Index 7 (value 12) is the octave (degree 8).
const MAJOR_SCALE_SEMITONES = [
  0, 2, 4, 5, 7, 9, 11, // degrees 1–7
  12,                    // degree 8 = octave  (index 7)
  14, 16, 17, 19, 21, 23, 24, 26, 28, 29, // degrees 9–18
] as const;

const OCTAVE_INDEX = 7; // MAJOR_SCALE_SEMITONES[7] === 12

// ── Degree-index groups per position ─────────────────────────────────────────
// Each sub-array = the semitone-series indices assigned to one string,
// starting from the tonic string (group 0) going up in pitch.
const DEGREE_GROUPS: Record<ScalePosition, readonly (readonly number[])[]> = {
  Derecha:   [[0,1,2], [3,4,5], [6,7,8],  [9,10,11], [12,13,14], [15,16,17]],
  Centro:    [[0,1],   [2,3,4], [5,6,7],  [8,9,10],  [11,12,13], [14,15,16]],
  Izquierda: [[0],     [1,2,3], [4,5,6],  [7,8,9],   [10,11,12], [13,14,15]],
};

// ── Tonic constraints per position ───────────────────────────────────────────
// validTonicStrings: strings (by index in STRING_ORDER) where tonic can land.
// We allow strings whose index gives at least 2 strings remaining (≥ 2 more
// strings above the tonic) so there is always room for the scale.
// Per the spec:
//   Derecha / Centro : strings 3–6 → STRING_ORDER indices 0–3 (E6,A,D,G)
//   Izquierda        : strings 4–6 → STRING_ORDER indices 0–2 (E6,A,D)
const VALID_TONIC_STRINGS: Record<ScalePosition, StringName[]> = {
  Derecha:   ["E6", "A", "D", "G"],
  Centro:    ["E6", "A", "D", "G"],
  Izquierda: ["E6", "A", "D"],
};

// Fret limits per position (inclusive)
const FRET_LIMITS: Record<ScalePosition, { min: number; max: number }> = {
  Derecha:   { min: 1,  max: 12 },
  Centro:    { min: 2,  max: 12 },
  Izquierda: { min: 4,  max: 12 },
};

// ── Core algorithm ────────────────────────────────────────────────────────────

/**
 * Given tonic position + scale parameters, return every fret position the
 * user must select.
 *
 * For `scope === "1-8va"` we stop after including semitone-series index 7
 * (the octave, degree 8).  For `scope === "all-strings"` we continue until
 * strings run out.
 */
export function getScalePositions(
  tonicString: StringName,
  tonicFret: number,
  position: ScalePosition,
  scope: ScaleScope,
): Position[] {
  const tonicMidi  = fretToMidi(tonicString, tonicFret);
  const groups     = DEGREE_GROUPS[position];
  const tonicIdx   = STRING_ORDER.indexOf(tonicString);
  const positions: Position[] = [];
  let   reachedOctave = false;

  for (let g = 0; g < groups.length; g++) {
    const stringIdx = tonicIdx + g;
    if (stringIdx >= STRING_ORDER.length) break; // ran out of strings

    const targetString = STRING_ORDER[stringIdx];
    const openMidi     = STRING_OPEN_MIDI[targetString];

    // Which degree indices go on this string?
    let degreeIndices = [...groups[g]];

    if (scope === "1-8va") {
      // Trim to only include indices up to and including the octave index
      degreeIndices = degreeIndices.filter((i) => i <= OCTAVE_INDEX);
    }

    if (degreeIndices.length === 0) break;

    for (const idx of degreeIndices) {
      const semi = MAJOR_SCALE_SEMITONES[idx];
      const fret = tonicMidi + semi - openMidi;
      if (fret >= 0 && fret <= 20) {
        positions.push({ string: targetString, fret });
      }
      if (idx === OCTAVE_INDEX) reachedOctave = true;
    }

    if (scope === "1-8va" && reachedOctave) break;
  }

  return positions.filter(
    (p) => !(p.string === tonicString && p.fret === tonicFret)
  );
}

// ── Question generation ───────────────────────────────────────────────────────

const POSITIONS: ScalePosition[] = ["Derecha", "Centro", "Izquierda"];
const SCOPES:    ScaleScope[]    = ["1-8va", "all-strings"];

const SCOPE_LABELS: Record<ScaleScope, string> = {
  "1-8va":        "1 Octava",
  "all-strings":  "Cuerdas Restantes",
};

/** Generate a random major-scale question, retrying until positions are valid. */
export function generateScaleQuestion(): ScaleQuestionData {
  const MAX_ATTEMPTS = 100;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Random position, scope
    const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    const scope    = SCOPES[Math.floor(Math.random() * SCOPES.length)];

    // Random tonic string
    const validStrings = VALID_TONIC_STRINGS[position];
    const tonicString  = validStrings[Math.floor(Math.random() * validStrings.length)];

    // Random tonic fret within spec limits
    const { min, max } = FRET_LIMITS[position];
    const tonicFret = min + Math.floor(Math.random() * (max - min + 1));

    // Compute correct positions
    const correctPositions = getScalePositions(tonicString, tonicFret, position, scope);
    if (correctPositions.length === 0) continue; // shouldn't happen, but guard

    const tonicMidi = fretToMidi(tonicString, tonicFret);
    const tonicNote = midiToTonicName(tonicMidi) as NoteName;

    return {
      kind: "scale",
      tonicString,
      tonicFret,
      tonicNote,
      position,
      positionLabel: position,
      scope,
      scopeLabel: SCOPE_LABELS[scope],
      correctPositions,
    };
  }

  throw new Error("Could not generate a valid scale question after many attempts");
}

// ── Re-exports ────────────────────────────────────────────────────────────────
export type { Position, StringName, NoteName };
