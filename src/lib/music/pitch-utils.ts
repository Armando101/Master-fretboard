// ── Pitch utility functions (pure, no browser/React deps) ────────────────────

/**
 * Minimum RMS amplitude below which we consider the input as silence.
 * Helps avoid triggering on background hum or breathing.
 */
export const SILENCE_THRESHOLD = 0.01;

/**
 * Minimum clarity (0–1) from the McLeod Pitch Method required to accept a
 * detected pitch as a real note. Values < 0.85 are usually noise or harmonics.
 */
export const CLARITY_THRESHOLD = 0.9;

/**
 * How many consecutive animation frames must agree on the same MIDI note
 * before we fire a "note detected" event. Prevents phantom triggers from
 * pluck transients.
 */
export const CONFIRMATION_FRAMES = 2;

/**
 * Convert a frequency in Hz to the nearest MIDI note number.
 * Formula: p = round(69 + 12 * log2(f / 440))
 */
export function freqToMidi(freq: number): number {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

/**
 * Compute Root Mean Square amplitude of a Float32Array sample buffer.
 * Used as a quick loudness gate before running pitch detection.
 */
export function computeRms(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}
