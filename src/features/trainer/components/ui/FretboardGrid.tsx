"use client";

import { useRef, useEffect } from "react";
import { fretToMidi, midiToName } from "@/lib/music/notes";
import type {
  FretboardNotes,
  NoteState,
  StringName,
} from "../../domain/trainer.types";

// ── Layout constants (px) ────────────────────────────────────────────────────
const ROW_H       = 52;   // height per string row
const COL_W       = 68;   // width per fret column (wider for easier clicking)
const NUT_W       = 44;   // width of the nut column
const LABEL_W     = 36;   // width of string-name label column
const BOARD_H     = 6 * ROW_H; // 312px

// ── String display order: E1 (top/thin) → E6 (bottom/thick) ─────────────────
// Standard guitar orientation when neck is laid flat
const DISPLAY_STRINGS: StringName[] = ["E1", "B", "G", "D", "A", "E6"];

// ── String visual properties ─────────────────────────────────────────────────
const STRING_THICKNESS: Record<StringName, number> = {
  E1: 1, B: 1, G: 1.5, D: 2, A: 2.5, E6: 3,
};
const STRING_OPACITY: Record<StringName, number> = {
  E1: 0.2, B: 0.22, G: 0.3, D: 0.35, A: 0.4, E6: 0.45,
};

// ── Inlay dot positions ───────────────────────────────────────────────────────
const SINGLE_DOTS = [3, 5, 7, 9, 15, 17, 19];
const DOUBLE_DOTS = [12];

// ── Note state styles ─────────────────────────────────────────────────────────
const STATE_BG: Record<Exclude<NoteState, "default">, string> = {
  tonic:     "#2196f3",
  selected:  "#9ecaff",
  correct:   "#4edea3",
  incorrect: "#ffb4ab",
};
const STATE_TEXT: Record<Exclude<NoteState, "default">, string> = {
  tonic:     "#003258",
  selected:  "#003258",
  correct:   "#003824",
  incorrect: "#690005",
};
const STATE_SHADOW: Record<Exclude<NoteState, "default">, string> = {
  tonic:     "0 0 14px rgba(33,150,243,0.55)",
  selected:  "0 0 10px rgba(158,202,255,0.45)",
  correct:   "0 0 14px rgba(78,222,163,0.55)",
  incorrect: "0 0 14px rgba(255,180,171,0.55)",
};

interface FretboardGridProps {
  notes: FretboardNotes;
  onCellClick?: (stringName: StringName, fret: number) => void;
  /** When provided, the fretboard auto-scrolls to center this fret on every change */
  tonicFret?: number;
}

// Frets 1–FRET_COUNT are interactive; fret 0 = open string in nut area
const FRET_COUNT = 20;
const FRETS = Array.from({ length: FRET_COUNT }, (_, i) => i + 1); // 1–20

/** x-coordinate of the LEFT edge of a fret column (1-indexed) */
function fretLeft(fret: number): number {
  return LABEL_W + NUT_W + (fret - 1) * COL_W;
}

/** x-coordinate of the center of a fret column */
function fretCenter(fret: number): number {
  return fretLeft(fret) + COL_W / 2;
}

/** y-coordinate of the CENTER of a string row */
function rowCenter(rowIdx: number): number {
  return rowIdx * ROW_H + ROW_H / 2;
}

export default function FretboardGrid({ notes, onCellClick, tonicFret }: FretboardGridProps) {
  const totalWidth = LABEL_W + NUT_W + FRET_COUNT * COL_W + 16;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to center the tonic fret whenever it changes
  useEffect(() => {
    if (tonicFret == null || !scrollRef.current) return;
    const container = scrollRef.current;
    // Center of the tonic fret column in absolute px (relative to scroll content)
    const tonicCenterX = LABEL_W + NUT_W + (tonicFret - 0.5) * COL_W;
    const scrollTarget = tonicCenterX - container.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
  }, [tonicFret]);

  return (
    <div ref={scrollRef} className="overflow-x-auto fretboard-scroll pb-4">
      <div
        className="bg-[#1c1b1b] rounded-xl overflow-hidden relative fretboard-shadow border border-[#404752]/10"
        style={{ minWidth: totalWidth }}
      >
        {/* ── Fret number header ─────────────────────────────────────────────── */}
        <div
          className="flex border-b border-[#404752]/10"
          style={{ marginLeft: LABEL_W, height: 32 }}
        >
          {/* NUT label */}
          <div
            className="flex items-center justify-center text-[10px] text-[#bfc7d4]/30 shrink-0"
            style={{ width: NUT_W, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            NUT
          </div>
          {/* Fret numbers — each centered in its column */}
          {FRETS.map((fret) => (
            <div
              key={fret}
              className="flex items-center justify-center text-[10px] text-[#bfc7d4]/30 shrink-0"
              style={{ width: COL_W, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {fret}
            </div>
          ))}
        </div>

        {/* ── Fretboard body (absolutely positioned) ─────────────────────────── */}
        <div
          className="relative"
          style={{ height: BOARD_H, marginLeft: LABEL_W }}
        >
          {/* ── String lines ─────────────────────────────────────────────────── */}
          {DISPLAY_STRINGS.map((s, rowIdx) => (
            <div
              key={s}
              className="absolute pointer-events-none"
              style={{
                top: rowCenter(rowIdx) - STRING_THICKNESS[s] / 2,
                left: 0,
                right: 0,
                height: STRING_THICKNESS[s],
                backgroundColor: "#bfc7d4",
                opacity: STRING_OPACITY[s],
              }}
            />
          ))}

          {/* ── Nut (thick vertical bar) ─────────────────────────────────────── */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              height: BOARD_H,
              left: NUT_W,
              width: 3,
              background: "rgba(100,100,100,0.7)",
            }}
          />

          {/* ── Fret wires ───────────────────────────────────────────────────── */}
          {FRETS.map((fret) => (
            <div
              key={fret}
              className="absolute pointer-events-none"
              style={{
                top: 0,
                height: BOARD_H,
                left: NUT_W + fret * COL_W,
                width: 1,
                background: "rgba(80,80,80,0.5)",
              }}
            />
          ))}

          {/* ── Inlay — single dots ───────────────────────────────────────────── */}
          {SINGLE_DOTS.map((fret) => (
            <div
              key={fret}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 12,
                height: 12,
                backgroundColor: "rgba(229,226,225,0.09)",
                top: BOARD_H / 2 - 6,
                left: NUT_W + (fret - 1) * COL_W + COL_W / 2 - 6,
              }}
            />
          ))}

          {/* ── Inlay — double dots (fret 12) ───────────────────────────────── */}
          {DOUBLE_DOTS.map((fret) =>
            [BOARD_H * 0.25, BOARD_H * 0.75].map((yPct, i) => (
              <div
                key={`${fret}-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: "rgba(229,226,225,0.09)",
                  top: yPct - 6,
                  left: NUT_W + (fret - 1) * COL_W + COL_W / 2 - 6,
                }}
              />
            ))
          )}

          {/* ── String labels (left column) ──────────────────────────────────── */}
          {DISPLAY_STRINGS.map((s, rowIdx) => (
            <div
              key={s}
              className="absolute flex items-center justify-center"
              style={{
                top: rowIdx * ROW_H,
                left: -LABEL_W,
                width: LABEL_W,
                height: ROW_H,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 11,
                fontWeight: "bold",
                color: "rgba(191,199,212,0.45)",
              }}
            >
              {s.replace("6", "").replace("1", "")}
            </div>
          ))}

          {/* ── Interactive fret cells ────────────────────────────────────────── */}
          {DISPLAY_STRINGS.map((stringName, rowIdx) =>
            FRETS.map((fret) => {
              const key = `${stringName}-${fret}`;
              const state: NoteState = notes[key] ?? "default";
              const isClickable = state === "default" || state === "selected";
              const hasNote = state !== "default";

              // Compute note name for tonic / correct / incorrect labels
              const shouldShowLabel =
                state === "tonic" || state === "correct" || state === "incorrect";
              const noteName = shouldShowLabel
                ? midiToName(fretToMidi(stringName, fret))
                : "";

              return (
                <div
                  key={key}
                  onClick={() => isClickable && onCellClick?.(stringName, fret)}
                  className="absolute flex items-center justify-center transition-colors"
                  style={{
                    top: rowIdx * ROW_H,
                    left: NUT_W + (fret - 1) * COL_W,
                    width: COL_W,
                    height: ROW_H,
                    cursor: isClickable ? "pointer" : "default",
                    zIndex: 10,
                  }}
                >
                  {hasNote ? (
                    /* Coloured note circle */
                    <div
                      className="flex items-center justify-center rounded-full transition-all"
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: STATE_BG[state as Exclude<NoteState, "default">],
                        color: STATE_TEXT[state as Exclude<NoteState, "default">],
                        boxShadow: STATE_SHADOW[state as Exclude<NoteState, "default">],
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: noteName.length > 1 ? 9 : 11,
                        fontWeight: "bold",
                        userSelect: "none",
                      }}
                    >
                      {noteName}
                    </div>
                  ) : (
                    /* Hover ghost circle for empty cells */
                    <div
                      className="rounded-full transition-all duration-150 hover:bg-[#353535]/70 group-hover:opacity-100"
                      style={{ width: 30, height: 30 }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
