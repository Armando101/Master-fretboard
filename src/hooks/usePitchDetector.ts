"use client";

import { useEffect, useRef, useCallback } from "react";
import { PitchService } from "@/services/PitchService";
import { usePitchStore } from "@/store/pitch.store";
import { useSessionStore } from "@/store/session.store";
import { CLARITY_THRESHOLD, CONFIRMATION_FRAMES } from "@/lib/music/pitch-utils";
import { STRING_ORDER, STRING_OPEN_MIDI } from "@/lib/music/notes";
import type { StringName } from "@/lib/music/notes";

/** Duration (ms) the "mic-flash" highlight stays lit on the fretboard. */
const FLASH_DURATION_MS = 500;

// ── Types shared with the caller ──────────────────────────────────────────────

export interface MicFlash {
  /** "String-fret" key, e.g. "G-5" */
  key: string;
  /** Timestamp (Date.now()) when the flash should expire */
  expiresAt: number;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Drives real-time pitch detection from the microphone.
 *
 * When `isMicListening` is true the hook:
 *   1. Starts PitchService on mount / when listening resumes.
 *   2. Runs a requestAnimationFrame loop reading pitch frames.
 *   3. Requires CONFIRMATION_FRAMES consecutive frames matching the same MIDI
 *      note before accepting it (avoids pluck transients).
 *   4. Calls `selectPosition` in the session store with the fret nearest to the
 *      tonic fret that matches the detected MIDI pitch class.
 *   5. Fires a 500 ms "mic-flash" visual on the detected cell.
 *
 * @param onFlash   Called with a MicFlash when a note is accepted. The caller
 *                  should remove it from the fretboard after `expiresAt`.
 */
export function usePitchDetector(
  onFlash?: (flash: MicFlash) => void
): void {
  const { isMicEnabled, isMicListening, setDetection } = usePitchStore();
  const { selectPosition, question, feedbackState, config } = useSessionStore();

  // Track consecutive frames agreeing on the same MIDI note
  const consecutiveRef = useRef<{ midi: number; count: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  // ── Start / stop PitchService when listening state changes ────────────────
  useEffect(() => {
    if (!isMicEnabled || !config?.useMic) return;

    if (isMicListening) {
      PitchService.start().catch((err) => {
        console.error("[PitchDetector] Microphone access denied:", err);
      });
    } else {
      PitchService.stop();
    }

    return () => {
      // Clean up when the component unmounts or listening stops
      PitchService.stop();
    };
  }, [isMicEnabled, isMicListening, config?.useMic]);

  // ── rAF loop ──────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (!isMicListening || feedbackState !== "idle") {
      consecutiveRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const frame = PitchService.getFrame();

    if (!frame || frame.clarity < CLARITY_THRESHOLD) {
      consecutiveRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    // Update store with latest raw detection (for any potential UI indicator)
    setDetection(frame);

    const { midi } = frame;

    // Accumulate consecutive frames for the same MIDI note
    if (consecutiveRef.current?.midi === midi) {
      consecutiveRef.current.count += 1;
    } else {
      consecutiveRef.current = { midi, count: 1 };
    }

    // Only accept the note once it's been stable for CONFIRMATION_FRAMES
    if (consecutiveRef.current.count >= CONFIRMATION_FRAMES && question) {
      consecutiveRef.current = null; // reset so we don't re-fire immediately

      // ── Find the fret on any string that matches the detected MIDI pitch class ──
      // We search all 6 strings × frets 1-20 and pick the position closest to
      // the tonic fret (ergonomically most natural for the user).
      const targetPc = ((midi % 12) + 12) % 12;

      let bestPos: { string: StringName; fret: number } | null = null;
      let bestDist = Infinity;

      for (const s of STRING_ORDER) {
        for (let fret = 1; fret <= 20; fret++) {
          const noteMidi = STRING_OPEN_MIDI[s] + fret;
          const notePc = ((noteMidi % 12) + 12) % 12;
          if (notePc === targetPc) {
            const dist = Math.abs(fret - question.tonicFret);
            if (dist < bestDist) {
              bestDist = dist;
              bestPos = { string: s, fret };
            }
          }
        }
      }

      if (bestPos) {
        selectPosition(bestPos);
        onFlash?.({
          key: `${bestPos.string}-${bestPos.fret}`,
          expiresAt: Date.now() + FLASH_DURATION_MS,
        });
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [isMicListening, feedbackState, question, selectPosition, setDetection, onFlash]);

  useEffect(() => {
    if (!isMicEnabled || !config?.useMic) return;

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isMicEnabled, config?.useMic, tick]);
}
