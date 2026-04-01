"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TopAppBar from "@/shared/components/ui/TopAppBar";
import BottomNavBar from "@/shared/components/ui/BottomNavBar";
import TrainingModeCard from "../ui/TrainingModeCard";
import SessionParameters from "../ui/SessionParameters";
import { useSessionStore } from "@/store/session.store";
import {
  TRAINING_MODE_OPTIONS,
  type TrainingMode,
  type QuestionCount,
  type TriadInversion,
  type TriadQuality,
} from "../../domain/main-menu.types";

export default function MainMenuContainer() {
  const router = useRouter();
  const startSession = useSessionStore((s) => s.startSession);

  const [selectedMode,      setSelectedMode]      = useState<TrainingMode>("intervals");
  const [selectedCount,     setSelectedCount]      = useState<QuestionCount>(10);
  const [selectedInversions, setSelectedInversions]  = useState<TriadInversion[]>(["fundamental"]);
  const [selectedQualities,   setSelectedQualities]    = useState<TriadQuality[]>([
    "major", "minor", "sus2", "sus4", "diminished", "augmented"
  ]);

  const handleStart = () => {
    const qualitiesToPass = selectedQualities.filter(
      (q): q is Exclude<TriadQuality, "all"> => q !== "all"
    );

    startSession({
      mode: selectedMode,
      totalQuestions: selectedCount ?? Infinity,
      triadInversions: selectedInversions,
      triadQualities: qualitiesToPass,
    });
    router.push("/trainer");
  };

  return (
    <>
      <TopAppBar />
      <BottomNavBar activeTab="practice" />

      {/* Decorative fretboard string accents */}
      <div className="fixed bottom-24 left-0 w-full h-[1px] bg-[#393939]/20 z-0 pointer-events-none" />
      <div className="fixed bottom-32 left-0 w-full h-px bg-[#393939]/10 z-0 pointer-events-none" />
      <div className="fixed bottom-16 left-0 w-full h-px bg-[#393939]/10 z-0 pointer-events-none" />

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Hero title — mobile only (order-1), hidden on desktop ── */}
        <div className="space-y-4 order-1 lg:hidden">
          <span
            className="text-[#9ecaff] font-medium tracking-widest text-sm uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Training Module
          </span>
          <h2
            className="text-5xl font-bold leading-tight tracking-tighter text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Master the <br />
            <span className="text-[#ffe2ab]">Fretboard</span>
          </h2>
          <p className="text-[#bfc7d4] max-w-md font-light leading-relaxed">
            Select your focus area and calibrate your session. Technical
            precision through disciplined repetition in the digital atelier.
          </p>
        </div>

        {/* ── Left Column — title (desktop only) + session params ── */}
        <section className="lg:col-span-5 flex flex-col gap-10 order-3 lg:order-1">
          {/* Title block — desktop only */}
          <div className="space-y-4 hidden lg:block">
            <span
              className="text-[#9ecaff] font-medium tracking-widest text-sm uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Training Module
            </span>
            <h2
              className="text-5xl font-bold leading-tight tracking-tighter text-[#e5e2e1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Master the <br />
              <span className="text-[#ffe2ab]">Fretboard</span>
            </h2>
            <p className="text-[#bfc7d4] max-w-md font-light leading-relaxed">
              Select your focus area and calibrate your session. Technical
              precision through disciplined repetition in the digital atelier.
            </p>
          </div>

          <SessionParameters
            selectedCount={selectedCount}
            onSelectCount={setSelectedCount}
            selectedMode={selectedMode}
            selectedInversions={selectedInversions}
            onSelectInversions={setSelectedInversions}
            selectedQualities={selectedQualities}
            onSelectQualities={setSelectedQualities}
            onStart={handleStart}
          />
        </section>

        {/* ── Right Column: Bento Grid — order-2 on mobile ── */}
        <section className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 order-2 lg:order-2">
          {TRAINING_MODE_OPTIONS.map((option) => (
            <TrainingModeCard
              key={option.mode}
              option={option}
              isSelected={selectedMode === option.mode}
              onClick={setSelectedMode}
            />
          ))}
        </section>
      </main>
    </>
  );
}
