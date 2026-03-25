"use client";

import { useState } from "react";
import TopAppBar from "@/shared/components/ui/TopAppBar";
import BottomNavBar from "@/shared/components/ui/BottomNavBar";
import FretboardGrid from "../ui/FretboardGrid";
import FeedbackBanner from "../ui/FeedbackBanner";
import SessionSnapshot from "../ui/SessionSnapshot";
import type {
  FretboardNotes,
  FeedbackState,
  SessionStats,
  StringName,
} from "../../domain/trainer.types";

// ── Static placeholder state (no logic yet) ─────────────────────────────────
const PLACEHOLDER_NOTES: FretboardNotes = {
  "A-3":  "tonic",
  "A-4":  "incorrect",
  "A-7":  "correct",
};

const PLACEHOLDER_STATS: SessionStats = { correct: 12, total: 14 };

export default function TrainerContainer() {
  const [notes, setNotes] = useState<FretboardNotes>(PLACEHOLDER_NOTES);
  const [feedbackState] = useState<FeedbackState>("correct");
  const [feedbackMsg] = useState(
    "Has localizado la Tercera Mayor (3M) de C (Do) correctamente en E (Mi)."
  );
  const [stats] = useState<SessionStats>(PLACEHOLDER_STATS);

  const handleCellClick = (stringName: StringName, fret: number) => {
    const key = `${stringName}-${fret}`;
    setNotes((prev) => {
      const updated = { ...prev };
      if (updated[key] === "selected") {
        delete updated[key];
      } else {
        updated[key] = "selected";
      }
      return updated;
    });
  };

  return (
    <>
      <TopAppBar />
      <BottomNavBar activeTab="practice" />

      <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-1">
          {/* Instructions panel */}
          <section className="bg-[#1c1b1b] p-8 rounded-xl relative overflow-hidden">
            <div className="space-y-6">
              <div>
                <p
                  className="text-[#9ecaff] tracking-widest uppercase text-xs mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Visual Fretboard Training
                </p>
                <h1
                  className="text-2xl font-bold leading-tight tracking-tight text-[#e5e2e1]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Identificación de Intervalos
                </h1>
              </div>

              <div className="p-4 bg-[#20201f] rounded-lg border border-[#404752]/10">
                <p className="text-[#bfc7d4] text-sm leading-relaxed">
                  Localiza el intervalo solicitado en el mástil tomando como
                  referencia la tónica indicada.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  className="w-full py-4 px-6 cta-gradient text-[#002c4f] font-bold rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Verificar
                </button>
                <button
                  className="w-full py-4 px-6 bg-[#353535] text-[#e5e2e1] font-bold rounded-md flex items-center justify-center gap-2 border border-[#404752]/10 hover:bg-[#393939] transition-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Siguiente pregunta
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* Session stats */}
          <SessionSnapshot stats={stats} />
        </div>

        {/* ── Right Column: Fretboard ── */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-[#1c1b1b] p-2 md:p-8 rounded-xl flex flex-col min-h-[500px]">
            {/* Question header */}
            <div className="flex justify-between items-center mb-8 px-4">
              <div className="flex flex-col gap-1">
                <h2
                  className="text-xl font-bold text-[#e5e2e1]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Selecciona un intervalo de{" "}
                  <span className="text-[#9ecaff]">3M</span>
                </h2>
                {/* Legend */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2196f3]" />
                    <span className="text-xs font-bold text-[#bfc7d4] uppercase">
                      Tónica: C
                    </span>
                  </div>
                  <div className="w-px h-3 bg-[#404752]/30" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#4edea3]" />
                    <span className="text-xs text-[#bfc7d4] uppercase">
                      Seleccionada
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className="text-[10px] tracking-[0.2em] opacity-30 block text-[#e5e2e1]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  FRETBOARD MASTER
                </span>
                <span
                  className="text-[10px] tracking-[0.2em] opacity-30 text-[#e5e2e1]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  V.1.0
                </span>
              </div>
            </div>

            {/* The fretboard */}
            <FretboardGrid notes={notes} onCellClick={handleCellClick} />

            {/* Feedback banners */}
            <div className="mt-6 space-y-3">
              <FeedbackBanner state={feedbackState} message={feedbackMsg} />
            </div>

            {/* Footer bar */}
            <div className="mt-auto pt-6 border-t border-[#404752]/10 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-[#bfc7d4]">
                <span className="material-symbols-outlined text-sm">
                  settings_input_component
                </span>
                <span className="text-xs uppercase tracking-tighter">
                  Afinación: Standard (EADGBE)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
