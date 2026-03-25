import type {
  FretboardNotes,
  NoteState,
  StringName,
} from "../../domain/trainer.types";
import {
  STRING_NAMES,
  FRET_COUNT,
  INLAY_FRETS_SINGLE,
  INLAY_FRET_DOUBLE,
} from "../../domain/trainer.types";

// ── Note cell colour mapping ────────────────────────────────────────────────
const NOTE_STATE_STYLES: Record<NoteState, string> = {
  default:   "bg-transparent cursor-pointer hover:bg-[#353535]/60",
  tonic:     "bg-[#2196f3] text-[#002c4f] font-bold bloom-primary cursor-default",
  selected:  "bg-[#9ecaff] text-[#003258] font-bold cursor-pointer",
  correct:   "bg-[#4edea3] text-[#003824] font-bold bloom-tertiary cursor-default",
  incorrect: "bg-[#ffb4ab] text-[#690005] font-bold bloom-error cursor-default",
};

const STRING_THICKNESS: Record<StringName, string> = {
  E1: "h-px",
  B:  "h-px",
  G:  "h-[1.5px]",
  D:  "h-[2px]",
  A:  "h-[2.5px]",
  E6: "h-[3px]",
};

const STRING_OPACITY: Record<StringName, string> = {
  E1: "opacity-20",
  B:  "opacity-20",
  G:  "opacity-30",
  D:  "opacity-30",
  A:  "opacity-40",
  E6: "opacity-40",
};

interface FretboardGridProps {
  notes: FretboardNotes;
  onCellClick?: (stringName: StringName, fret: number) => void;
}

const FRET_WIDTH = "w-20";  // 5rem per fret column
const NUT_WIDTH  = "w-16";  // 4rem for nut column

export default function FretboardGrid({ notes, onCellClick }: FretboardGridProps) {
  const frets = Array.from({ length: FRET_COUNT + 1 }, (_, i) => i); // 0-12

  return (
    <div className="overflow-x-auto fretboard-scroll pb-4">
      <div
        className="min-w-[1100px] bg-[#1c1b1b] rounded-xl overflow-hidden relative fretboard-shadow border border-[#404752]/10"
      >
        {/* ── Fret number labels ─────────────────────────────── */}
        <div className="flex ml-12 border-b border-[#404752]/5">
          <div
            className={`${NUT_WIDTH} h-8 flex items-center justify-center text-[10px] text-[#bfc7d4]/40`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            NUT
          </div>
          {frets.slice(1).map((fret) => (
            <div
              key={fret}
              className={`${FRET_WIDTH} h-8 flex items-center justify-center text-[10px] text-[#bfc7d4]/40`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {fret}
            </div>
          ))}
        </div>

        {/* ── Fretboard body ─────────────────────────────────── */}
        <div className="relative py-4">
          {/* String lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-10 pointer-events-none px-12">
            {STRING_NAMES.map((s) => (
              <div
                key={s}
                className={`${STRING_THICKNESS[s]} w-full bg-[#bfc7d4] ${STRING_OPACITY[s]}`}
              />
            ))}
          </div>

          {/* Fret wires */}
          <div className="absolute inset-0 flex ml-12 pointer-events-none">
            {/* Nut (thicker) */}
            <div className={`${NUT_WIDTH} h-full border-r-[3px] border-[#393939]/50`} />
            {/* Fret wires */}
            {frets.slice(1).map((fret) => (
              <div
                key={fret}
                className={`${FRET_WIDTH} h-full border-r border-[#393939]/40`}
              />
            ))}
          </div>

          {/* Inlay dots */}
          <div className="absolute inset-0 flex ml-12 pointer-events-none items-center">
            {/* Nut spacer */}
            <div className={NUT_WIDTH} />
            {frets.slice(1).map((fret) => {
              const isDouble = fret === INLAY_FRET_DOUBLE;
              const isSingle = INLAY_FRETS_SINGLE.includes(fret);
              return (
                <div key={fret} className={`${FRET_WIDTH} flex flex-col items-center justify-center gap-6`}>
                  {isDouble ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#e5e2e1]/5" />
                      <div className="w-2 h-2 rounded-full bg-[#e5e2e1]/5" />
                    </>
                  ) : isSingle ? (
                    <div className="w-2 h-2 rounded-full bg-[#e5e2e1]/5" />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Note interaction grid */}
          <div className="relative z-10 flex flex-col gap-4 py-2">
            {STRING_NAMES.map((stringName) => (
              <div key={stringName} className="flex items-center ml-12 h-8">
                {/* String label */}
                <div className={`${NUT_WIDTH} flex justify-center`}>
                  <div
                    className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center text-xs font-bold text-transparent"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {stringName.replace("6", "").replace("1", "")}
                  </div>
                </div>

                {/* Fret cells */}
                {frets.map((fret) => {
                  const key = `${stringName}-${fret}`;
                  const state: NoteState = notes[key] ?? "default";
                  const label = state !== "default" ? key.split("-")[0].replace("6","").replace("1","") : "";

                  return (
                    <div key={fret} className={`${FRET_WIDTH} flex justify-center`}>
                      <div
                        role={state === "default" ? "button" : undefined}
                        tabIndex={state === "default" ? 0 : undefined}
                        onClick={() =>
                          state === "default" && onCellClick?.(stringName, fret)
                        }
                        className={[
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] transition-all",
                          NOTE_STATE_STYLES[state],
                        ].join(" ")}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
