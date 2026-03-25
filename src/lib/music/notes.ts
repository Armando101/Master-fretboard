// ── Chromatic scale ───────────────────────────────────────────────────────────
export const CHROMATIC = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;
export type NoteName = (typeof CHROMATIC)[number];

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

/** Return the note name (e.g. "A", "C#") for a MIDI pitch */
export function midiToName(midi: number): NoteName {
  return CHROMATIC[((midi % 12) + 12) % 12];
}
