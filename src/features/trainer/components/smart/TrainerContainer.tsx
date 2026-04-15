"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/shared/components/ui/TopAppBar";
import { useLanguage } from "@/i18n/LanguageContext";

import FretboardGrid from "../ui/FretboardGrid";
import FeedbackBanner from "../ui/FeedbackBanner";
import SessionSnapshot from "../ui/SessionSnapshot";
import { useSessionStore } from "@/store/session.store";
import type { FretboardNotes, StringName } from "../../domain/trainer.types";

export default function TrainerContainer() {
  const router = useRouter();
  const { t } = useLanguage();
  const tr = t.trainer;

  const {
    phase,
    question,
    selectedPositions,
    feedbackState,
    revealedCorrect,
    revealedIncorrect,
    currentQuestionIndex,
    config,
    results,
    selectPosition,
    deselectPosition,
    verify,
    nextQuestion,
    finishEarly,
  } = useSessionStore();

  // Guard: if no active session, redirect to menu
  useEffect(() => {
    if (phase === "menu") {
      router.replace("/");
    } else if (phase === "summary") {
      router.replace("/summary");
    }
  }, [phase, router]);

  // Build FretboardNotes map from store state
  const notes: FretboardNotes = {};

  if (question) {
    // Place tónica
    notes[`${question.tonicString}-${question.tonicFret}`] = "tonic";

    if (feedbackState === "idle") {
      // Show selected positions (hide note names until verified)
      for (const pos of selectedPositions) {
        const key = `${pos.string}-${pos.fret}`;
        if (key !== `${question.tonicString}-${question.tonicFret}`) {
          notes[key] = "selected";
        }
      }
    } else {
      // After verify: show correct (green) and incorrect (red) positions
      for (const pos of revealedCorrect) {
        notes[`${pos.string}-${pos.fret}`] = "correct";
      }
      for (const pos of revealedIncorrect) {
        notes[`${pos.string}-${pos.fret}`] = "incorrect";
      }
    }
  }

  const correctCount = results.filter((r) => r.wasCorrect).length;
  const stats = { correct: correctCount, total: results.length };
  const totalQuestions = config?.totalQuestions ?? 0;
  const questionProgress = `${currentQuestionIndex + 1} / ${Number.isFinite(totalQuestions) ? totalQuestions : "∞"}`;
  const hasSelection = selectedPositions.length > 0;

  const handleCellClick = (stringName: StringName, fret: number) => {
    if (feedbackState !== "idle") return;
    const pos = { string: stringName, fret };
    const posKey = `${stringName}-${fret}`;
    const alreadySelected = selectedPositions.some(
      (p) => `${p.string}-${p.fret}` === posKey
    );
    if (alreadySelected) {
      deselectPosition(pos);
    } else {
      selectPosition(pos);
    }
  };

  if (!question) return null;

  // ── Question header content (differs by kind) ────────────────────────────
  const questionKind = question.kind; // "interval" | "scale" | "triad"

  // Resolve interval label from translations (locale-aware), fallback to stored label
  const resolvedIntervalLabel =
    questionKind === "interval"
      ? (tr.intervalLabels as Record<string, string>)[question.intervalSymbol] ?? question.intervalLabel
      : "";

  const questionHeadline =
    questionKind === "scale" ? (
      <>
        {tr.headlines.scale}{" "}
        <span className="text-[#9ecaff]">{question.position}</span>
        <span className="text-[#bfc7d4] text-sm font-normal ml-2">
          ({question.scopeLabel})
        </span>
      </>
    ) : questionKind === "triad" ? (
      <>
        {tr.headlines.triad}{" "}
        <span className="text-[#9ecaff]">{question.qualityLabel}</span>
        <span className="text-[#bfc7d4] text-sm font-normal ml-2">
          — {question.inversionLabel}
        </span>
      </>
    ) : (
      <>
        {tr.headlines.interval}{" "}
        <span className="text-[#9ecaff]">{question.intervalSymbol}</span>
        <span className="text-[#bfc7d4] text-sm font-normal ml-2">
          ({resolvedIntervalLabel})
        </span>
      </>
    );

  const getFeedbackMessage = () => {
    if (feedbackState !== "correct" && feedbackState !== "incorrect") {
      return undefined;
    }

    if (questionKind === "scale") {
      return feedbackState === "correct"
        ? tr.feedback.correctScale(question.tonicNote, question.positionLabel, question.scopeLabel)
        : tr.feedback.incorrectScale(question.tonicNote, question.positionLabel, question.scopeLabel);
    }

    if (questionKind === "triad") {
      return feedbackState === "correct"
        ? tr.feedback.correctTriad(question.qualityLabel, question.tonicNote)
        : tr.feedback.incorrectTriad(question.qualityLabel, question.tonicNote);
    }

    // interval — use the locale-resolved label in feedback too
    return feedbackState === "correct"
      ? tr.feedback.correctInterval(question.intervalSymbol, resolvedIntervalLabel, question.tonicNote)
      : tr.feedback.incorrectInterval(question.intervalSymbol, question.tonicNote);
  };

  const feedbackMessage = getFeedbackMessage();

  // ── Shared action-buttons ─────────────────────────────────────────────────
  const verifyBtn = (
    <button
      onClick={verify}
      disabled={!hasSelection || feedbackState !== "idle"}
      className={[
        "w-full py-4 px-6 font-bold rounded-md flex items-center justify-center gap-2 transition-all active:scale-95",
        hasSelection && feedbackState === "idle"
          ? "cta-gradient text-[#002c4f] hover:opacity-90"
          : "bg-[#2a2a2a] text-[#89919d] cursor-not-allowed",
      ].join(" ")}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <span className="material-symbols-outlined">check_circle</span>
      {tr.buttons.verify}
    </button>
  );

  const nextBtn = (
    <button
      onClick={nextQuestion}
      disabled={feedbackState === "idle"}
      className={[
        "w-full py-4 px-6 font-bold rounded-md flex items-center justify-center gap-2 border border-[#404752]/10 transition-all",
        feedbackState !== "idle"
          ? "bg-[#353535] text-[#e5e2e1] hover:bg-[#393939]"
          : "bg-[#1c1b1b] text-[#89919d] cursor-not-allowed",
      ].join(" ")}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {tr.buttons.next}
      <span className="material-symbols-outlined">arrow_forward</span>
    </button>
  );

  const finishBtn = (
    <button
      onClick={finishEarly}
      disabled={results.length === 0}
      className={[
        "w-full py-4 px-6 font-bold rounded-md flex items-center justify-center gap-2 border transition-all",
        results.length > 0
          ? "border-[#ff6b6b]/30 text-[#ff6b6b] hover:bg-[#ff6b6b]/10"
          : "border-[#404752]/10 text-[#89919d] cursor-not-allowed",
      ].join(" ")}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <span className="material-symbols-outlined text-base">flag</span>
      {tr.buttons.finish}
    </button>
  );

  return (
    <>
      <TopAppBar />

      <main className="pt-24 pb-48 lg:pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-1">
          <section className="bg-[#1c1b1b] p-8 rounded-xl relative overflow-hidden">
            <div className="space-y-6">
              <div>
                <p
                  className="text-[#9ecaff] tracking-widest uppercase text-xs mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {tr.kinds[questionKind]}
                </p>
                <h1
                  className="text-2xl font-bold leading-tight tracking-tight text-[#e5e2e1]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {tr.titles[questionKind]}
                </h1>
              </div>

              {/* Current question progress */}
              <div className="p-4 bg-[#20201f] rounded-lg border border-[#404752]/10 flex items-center justify-between">
                <p className="text-[#bfc7d4] text-sm">
                  {tr.question.label} {questionProgress}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4edea3] text-sm">
                    check_circle
                  </span>
                  <span className="text-sm text-[#4edea3] font-bold">
                    {correctCount} {tr.question.correct}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-[#20201f] rounded-lg border border-[#404752]/10">
                <p className="text-[#bfc7d4] text-sm leading-relaxed">
                  {tr.instructions[questionKind]}
                  <strong className="text-[#e5e2e1]">{tr.buttons.verify}</strong>.
                </p>
              </div>

              {/* Action buttons — desktop only */}
              <div className="hidden lg:flex flex-col gap-3">
                {verifyBtn}
                {nextBtn}
                {finishBtn}
              </div>
            </div>
          </section>

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
                  {questionHeadline}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2196f3]" />
                    <span className="text-xs font-bold text-[#bfc7d4] uppercase">
                      {tr.labels.tonic}: {question.tonicNote}
                    </span>
                  </div>
                  <div className="w-px h-3 bg-[#404752]/30" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#4edea3]" />
                    <span className="text-xs text-[#bfc7d4] uppercase">{tr.labels.selected}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
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
            <FretboardGrid
              notes={notes}
              onCellClick={handleCellClick}
              tonicFret={question.tonicFret}
            />

            {/* Feedback */}
            <div className="mt-6 space-y-3">
              <FeedbackBanner
                state={feedbackState}
                message={feedbackMessage}
              />
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-[#404752]/10 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-[#bfc7d4]">
                <span className="material-symbols-outlined text-sm">settings_input_component</span>
                <span className="text-xs uppercase tracking-tighter">
                  {tr.labels.tuning}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Mobile-only fixed action bar ────────────────────────────────────── */}
      <div
        className="lg:hidden fixed left-0 right-0 z-40 flex gap-2 px-4 py-3"
        style={{
          bottom: 90,
          backgroundColor: "rgba(19, 19, 19, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(64, 71, 82, 0.15)",
        }}
      >
        <button
          onClick={verify}
          disabled={!hasSelection || feedbackState !== "idle"}
          className={[
            "flex-1 py-3 px-4 font-bold rounded-md flex items-center justify-center gap-2 transition-all active:scale-95 text-sm",
            hasSelection && feedbackState === "idle"
              ? "cta-gradient text-[#002c4f]"
              : "bg-[#2a2a2a] text-[#89919d] cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="material-symbols-outlined text-base">check_circle</span>
          {tr.buttons.verify}
        </button>
        <button
          onClick={nextQuestion}
          disabled={feedbackState === "idle"}
          className={[
            "flex-1 py-3 px-4 font-bold rounded-md flex items-center justify-center gap-2 border border-[#404752]/10 transition-all text-sm",
            feedbackState !== "idle"
              ? "bg-[#353535] text-[#e5e2e1]"
              : "bg-[#1c1b1b] text-[#89919d] cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {tr.buttons.nextShort}
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
        <button
          onClick={finishEarly}
          disabled={results.length === 0}
          className={[
            "py-3 px-4 font-bold rounded-md flex items-center justify-center gap-1 border transition-all text-sm",
            results.length > 0
              ? "border-[#ff6b6b]/30 text-[#ff6b6b]"
              : "border-[#404752]/10 text-[#89919d] cursor-not-allowed",
          ].join(" ")}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="material-symbols-outlined text-base">flag</span>
          {tr.buttons.finishShort}
        </button>
      </div>
    </>
  );
}
