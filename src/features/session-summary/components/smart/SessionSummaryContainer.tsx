import TopAppBar from "@/shared/components/ui/TopAppBar";
import BottomNavBar from "@/shared/components/ui/BottomNavBar";
import ScoreHero from "../ui/ScoreHero";
import IntervalResultRow from "../ui/IntervalResultRow";
import type { SessionSummaryData } from "../../domain/session-summary.types";

// ── Static placeholder data (no logic yet) ───────────────────────────────────
const PLACEHOLDER_SUMMARY: SessionSummaryData = {
  correct: 15,
  total: 20,
  intervalResults: [
    { symbol: "2M", label: "Major Second",  correct: 2, total: 2 },
    { symbol: "P5", label: "Perfect Fifth", correct: 8, total: 8 },
    { symbol: "3M", label: "Major Third",   correct: 0, total: 3 },
    { symbol: "m7", label: "Minor Seventh", correct: 5, total: 7 },
  ],
};

export default function SessionSummaryContainer() {
  const { correct, total, intervalResults } = PLACEHOLDER_SUMMARY;

  return (
    <>
      <TopAppBar />
      <BottomNavBar activeTab="practice" />

      <main className="pt-24 px-6 pb-32 max-w-2xl mx-auto w-full">
        <ScoreHero correct={correct} total={total} />

        {/* Interval breakdown */}
        <section className="space-y-4">
          <h3
            className="text-xl font-medium text-[#bfc7d4] flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined text-[#ffe2ab]">analytics</span>
            Interval Breakdown
          </h3>

          <div className="grid gap-3">
            {intervalResults.map((result) => (
              <IntervalResultRow key={result.symbol} result={result} />
            ))}
          </div>
        </section>

        {/* Action buttons */}
        <section className="mt-12 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 py-4 rounded-md font-bold cta-gradient text-[#002c4f] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined">replay</span>
            Restart Session
          </button>
          <button
            className="flex-1 py-4 rounded-md font-bold bg-[#353535] text-[#e5e2e1] flex items-center justify-center gap-2 hover:bg-[#393939] active:scale-[0.98] transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="material-symbols-outlined">home</span>
            Back to Menu
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
              New Milestone Near!
            </p>
            <p className="text-[#bfc7d4] text-sm mt-1">
              Practice 2 more sessions to unlock the{" "}
              <em>&ldquo;Interval Master&rdquo;</em> badge.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
