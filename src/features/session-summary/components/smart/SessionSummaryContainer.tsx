"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/shared/components/ui/TopAppBar";
import BottomNavBar from "@/shared/components/ui/BottomNavBar";
import ScoreHero from "../ui/ScoreHero";
import IntervalResultRow from "../ui/IntervalResultRow";
import { useSessionStore } from "@/store/session.store";
import type { IntervalResult } from "../../domain/session-summary.types";

export default function SessionSummaryContainer() {
  const router = useRouter();
  const { phase, results, resetSession } = useSessionStore();

  // Guard: must be in summary phase
  useEffect(() => {
    if (phase === "menu") router.replace("/");
    if (phase === "training") router.replace("/trainer");
  }, [phase, router]);

  // Aggregate results by interval symbol
  const intervalBreakdown = results.reduce<Record<string, IntervalResult>>(
    (acc, r) => {
      if (!acc[r.intervalSymbol]) {
        acc[r.intervalSymbol] = {
          symbol: r.intervalSymbol,
          label: r.intervalLabel,
          correct: 0,
          total: 0,
        };
      }
      acc[r.intervalSymbol].total += 1;
      if (r.wasCorrect) acc[r.intervalSymbol].correct += 1;
      return acc;
    },
    {}
  );

  const intervalResults = Object.values(intervalBreakdown);
  const totalCorrect = results.filter((r) => r.wasCorrect).length;
  const total = results.length;

  const handleReset = () => {
    resetSession();
    router.push("/");
  };

  if (phase !== "summary") return null;

  return (
    <>
      <TopAppBar />
      <BottomNavBar activeTab="practice" />

      <main className="pt-24 px-6 pb-32 max-w-2xl mx-auto w-full">
        <ScoreHero correct={totalCorrect} total={total} />

        {/* Interval breakdown */}
        <section className="space-y-4">
          <h3
            className="text-xl font-medium text-[#bfc7d4] flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined text-[#ffe2ab]">analytics</span>
            Interval Breakdown
          </h3>

          {intervalResults.length === 0 ? (
            <p className="text-[#89919d] text-sm">No hay resultados.</p>
          ) : (
            <div className="grid gap-3">
              {intervalResults.map((result) => (
                <IntervalResultRow key={result.symbol} result={result} />
              ))}
            </div>
          )}
        </section>

        {/* Action buttons */}
        <section className="mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleReset}
            className="flex-1 py-4 rounded-md font-bold cta-gradient text-[#002c4f] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined">replay</span>
            Nueva sesión
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-4 rounded-md font-bold bg-[#353535] text-[#e5e2e1] flex items-center justify-center gap-2 hover:bg-[#393939] active:scale-[0.98] transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined">home</span>
            Volver al menú
          </button>
        </section>

        {/* Achievement teaser */}
        <div
          className="mt-8 p-6 rounded-xl flex items-center gap-6"
          style={{
            background: "linear-gradient(to right, rgba(255, 191, 0, 0.08), transparent)",
            border: "1px solid rgba(64, 71, 82, 0.15)",
          }}
        >
          <div className="hidden sm:flex w-14 h-14 rounded-full bg-[#ffbf00]/10 items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[#ffe2ab] text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emoji_events
            </span>
          </div>
          <div>
            <p
              className="text-[#ffe2ab] font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ¡Sigue practicando!
            </p>
            <p className="text-[#bfc7d4] text-sm mt-1">
              La consistencia es la clave para dominar el mástil.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
