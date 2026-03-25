"use client";

import { useState } from "react";
import TopAppBar from "@/shared/components/ui/TopAppBar";
import BottomNavBar from "@/shared/components/ui/BottomNavBar";
import TrainingModeCard from "../ui/TrainingModeCard";
import SessionParameters from "../ui/SessionParameters";
import {
  TRAINING_MODE_OPTIONS,
  type TrainingMode,
  type QuestionCount,
} from "../../domain/main-menu.types";

export default function MainMenuContainer() {
  const [selectedMode, setSelectedMode] = useState<TrainingMode>("intervals");
  const [selectedCount, setSelectedCount] = useState<QuestionCount>(10);

  const handleStart = () => {
    // Navigation to trainer will be wired in a later step
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
        {/* ── Left Column ── */}
        <section className="lg:col-span-5 flex flex-col gap-10">
          {/* Hero text */}
          <div className="space-y-4">
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

          {/* Session config */}
          <SessionParameters
            selectedCount={selectedCount}
            onSelectCount={setSelectedCount}
            onStart={handleStart}
          />
        </section>

        {/* ── Right Column: Bento Grid ── */}
        <section className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
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
