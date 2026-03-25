import {
  STRING_ORDER,
  getCumulativeOffset,
  getTargetString,
  fretToMidi,
  midiToName,
  type StringName,
  type NoteName,
} from "./notes";

// ── Interval definitions ──────────────────────────────────────────────────────

export interface IntervalConfig {
  semitones: number;
  label: string;        // human-readable Spanish name
  bidirectional: boolean;
  /** Ordered string-jump counts: [right jump, left jump] or [single jump] */
  stringJumps: number[];
  /** Which strings (guitar numbering 1=E1, 6=E6) can be the tónica for this interval */
  validTonicStrings: StringName[];
}

/**
 * Guitar string numbering: 1 = E1 (high), 6 = E6 (low)
 * cuerdas [2-6] = B, G, D, A, E6  (all except E1)
 * cuerdas [3-6] = G, D, A, E6     (for 8va — B and E1 excluded as tónica)
 */
const STRINGS_2_TO_6: StringName[] = ["E6", "A", "D", "G", "B"];
const STRINGS_3_TO_6: StringName[] = ["E6", "A", "D", "G"];

export const INTERVAL_CONFIG: Record<string, IntervalConfig> = {
  "2m": { semitones: 1,  label: "Segunda menor",   bidirectional: true,  stringJumps: [0, 1], validTonicStrings: STRINGS_2_TO_6 },
  "2M": { semitones: 2,  label: "Segunda mayor",   bidirectional: true,  stringJumps: [0, 1], validTonicStrings: STRINGS_2_TO_6 },
  "3m": { semitones: 3,  label: "Tercera menor",   bidirectional: true,  stringJumps: [0, 1], validTonicStrings: STRINGS_2_TO_6 },
  "3M": { semitones: 4,  label: "Tercera mayor",   bidirectional: true,  stringJumps: [0, 1], validTonicStrings: STRINGS_2_TO_6 },
  "4J": { semitones: 5,  label: "Cuarta justa",    bidirectional: false, stringJumps: [1],    validTonicStrings: STRINGS_2_TO_6 },
  "5J": { semitones: 7,  label: "Quinta justa",    bidirectional: true,  stringJumps: [1, 2], validTonicStrings: STRINGS_2_TO_6 },
  "6m": { semitones: 8,  label: "Sexta menor",     bidirectional: true,  stringJumps: [1, 2], validTonicStrings: STRINGS_2_TO_6 },
  "6M": { semitones: 9,  label: "Sexta mayor",     bidirectional: true,  stringJumps: [1, 2], validTonicStrings: STRINGS_2_TO_6 },
  "7m": { semitones: 10, label: "Séptima menor",   bidirectional: false, stringJumps: [2],    validTonicStrings: STRINGS_2_TO_6 },
  "7M": { semitones: 11, label: "Séptima mayor",   bidirectional: false, stringJumps: [2],    validTonicStrings: STRINGS_2_TO_6 },
  "8":  { semitones: 12, label: "Octava",           bidirectional: true,  stringJumps: [2, 3], validTonicStrings: STRINGS_3_TO_6 },
};

export const INTERVAL_POOL = Object.keys(INTERVAL_CONFIG);

// ── Position model ────────────────────────────────────────────────────────────

export interface Position {
  string: StringName;
  fret: number;
}

function positionKey(p: Position): string {
  return `${p.string}-${p.fret}`;
}

export function positionsMatch(a: Position[], b: Position[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a.map(positionKey));
  return b.every((p) => setA.has(positionKey(p)));
}

// ── Core algorithm ────────────────────────────────────────────────────────────

/**
 * Given a tónica position and an interval symbol, return the set of correct
 * fret positions the user must select.
 *
 * The algorithm uses the string-jump model derived from instructions.md:
 *   - Each interval has fixed string-jump counts (e.g. [0,1] or [1,2])
 *   - fret = tonicFret + semitones - cumulativeStringOffset(jump)
 *   - If the resulting fret is outside [0, 20], that position doesn't exist ("No hay")
 */
export function getCorrectPositions(
  tonicString: StringName,
  tonicFret: number,
  intervalSymbol: string
): Position[] {
  const config = INTERVAL_CONFIG[intervalSymbol];
  if (!config) return [];

  const positions: Position[] = [];

  for (const jump of config.stringJumps) {
    const targetString = getTargetString(tonicString, jump);
    if (!targetString) continue; // string doesn't exist

    const offset = getCumulativeOffset(tonicString, jump);
    const fret = tonicFret + config.semitones - offset;

    if (fret >= 0 && fret <= 20) {
      positions.push({ string: targetString, fret });
    }
  }

  return positions;
}

// ── Question model ────────────────────────────────────────────────────────────

export interface QuestionData {
  tonicString: StringName;
  tonicFret: number;
  tonicNote: NoteName;
  intervalSymbol: string;
  intervalLabel: string;
  correctPositions: Position[];
}

/** Generate a random question, ensuring there is at least one correct position */
export function generateQuestion(): QuestionData {
  const maxAttempts = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Random interval
    const intervalSymbol = INTERVAL_POOL[Math.floor(Math.random() * INTERVAL_POOL.length)];
    const config = INTERVAL_CONFIG[intervalSymbol];

    // Random valid tónica string
    const validStrings = config.validTonicStrings;
    const tonicString = validStrings[Math.floor(Math.random() * validStrings.length)];

    // Random tónica fret (5–12)
    const tonicFret = 5 + Math.floor(Math.random() * 8); // 5,6,7,8,9,10,11,12

    // Compute correct positions
    const correctPositions = getCorrectPositions(tonicString, tonicFret, intervalSymbol);
    if (correctPositions.length === 0) continue; // retry

    const tonicMidi = fretToMidi(tonicString, tonicFret);
    const tonicNote = midiToName(tonicMidi);

    return {
      tonicString,
      tonicFret,
      tonicNote,
      intervalSymbol,
      intervalLabel: config.label,
      correctPositions,
    };
  }

  // Fallback (should never happen with valid data)
  throw new Error("Could not generate a valid question after many attempts");
}

// ── Re-export for convenience ─────────────────────────────────────────────────
export type { StringName, NoteName };
export { STRING_ORDER };
