"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import TopAppBar from "@/shared/components/ui/TopAppBar";
import { useLanguage } from "@/i18n/LanguageContext";

import TrainingModeCard from "../ui/TrainingModeCard";
import SessionParameters from "../ui/SessionParameters";
import { useSessionStore } from "@/store/session.store";
import type { TriadInversion as MusicTriadInversion } from "@/lib/music/triads";
import { INTERVAL_POOL } from "@/lib/music/intervals";
import {
  TRAINING_MODE_OPTIONS,
  INTERVAL_OPTIONS,
  type TrainingMode,
  type QuestionCount,
  type TriadInversion,
  type TriadQuality,
  type IntervalSymbol,
} from "../../domain/main-menu.types";

export default function MainMenuContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const startSession = useSessionStore((s) => s.startSession);
  const { t } = useLanguage();

  // Default: all intervals selected (every enabled, non-"all" option)
  const allIntervalValues = INTERVAL_OPTIONS
    .filter(o => o.value !== "all" && o.enabled)
    .map(o => o.value as Exclude<IntervalSymbol, "all">);

  // Initialize state from URL search params or fallback to defaults
  const initialMode = (searchParams.get("mode") as TrainingMode) || "intervals";
  const countParam = searchParams.get("count");
  const initialCount = countParam === "null" ? null : (countParam ? Number(countParam) as QuestionCount : 10);
  
  const initialInversions = searchParams.get("inversions")
    ? (searchParams.get("inversions")!.split(",") as TriadInversion[])
    : (["fundamental"] as TriadInversion[]);
    
  const initialQualities = searchParams.get("qualities")
    ? (searchParams.get("qualities")!.split(",") as TriadQuality[])
    : (["major", "minor", "sus2", "sus4", "diminished", "augmented"] as TriadQuality[]);
    
  const initialIntervals = searchParams.get("intervals")
    ? (searchParams.get("intervals")!.split(",") as IntervalSymbol[])
    : allIntervalValues;

  const [selectedMode,       setSelectedMode]       = useState<TrainingMode>(initialMode);
  const [selectedCount,      setSelectedCount]       = useState<QuestionCount>(initialCount);
  const [selectedInversions, setSelectedInversions]  = useState<TriadInversion[]>(initialInversions);
  const [selectedQualities,  setSelectedQualities]   = useState<TriadQuality[]>(initialQualities);
  const [selectedIntervals,  setSelectedIntervals]   = useState<IntervalSymbol[]>(initialIntervals);

  // Sync state to URL when values change.
  // We compare against window.location.search (not the searchParams snapshot)
  // to avoid an infinite loop where updating the URL triggers a re-render that
  // triggers another update.
  useEffect(() => {
    const params = new URLSearchParams();

    // Always include mode
    params.set("mode", selectedMode);

    // Count: omit when it's the default (10)
    if (selectedCount !== 10) params.set("count", String(selectedCount));

    // Only include params that are relevant to the active mode
    if (selectedMode === "intervals") {
      const allSelected = allIntervalValues.every(v => selectedIntervals.includes(v));
      // Omit when everything is selected (default) — shorter URL
      if (!allSelected && selectedIntervals.length > 0) {
        params.set("intervals", selectedIntervals.join(","));
      }
    }

    if (selectedMode === "closed-triads") {
      const allInversions: TriadInversion[] = ["fundamental", "first", "second"];
      const allInversionsSelected = allInversions.every(v => selectedInversions.includes(v));
      if (!allInversionsSelected && selectedInversions.length > 0) {
        params.set("inversions", selectedInversions.join(","));
      }

      const allQualityValues: TriadQuality[] = ["major", "minor", "sus2", "sus4", "diminished", "augmented"];
      const allQualitiesSelected = allQualityValues.every(v => selectedQualities.includes(v));
      if (!allQualitiesSelected && selectedQualities.length > 0) {
        params.set("qualities", selectedQualities.join(","));
      }
    }

    const newQueryString = params.toString();
    // Use window.location.search to avoid stale-closure loop caused by
    // including searchParams in the dependency array.
    const currentQueryString = new URLSearchParams(window.location.search).toString();

    if (newQueryString !== currentQueryString) {
      router.replace(`${pathname}?${newQueryString}`, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode, selectedCount, selectedInversions, selectedQualities, selectedIntervals]);

  const handleStart = () => {
    const qualitiesToPass = selectedQualities.filter(
      (q): q is Exclude<TriadQuality, "all"> => q !== "all"
    );
    const inversionsToPass = selectedInversions.filter(
      (i): i is MusicTriadInversion => i !== "all"
    );
    // For intervals: filter out the "all" sentinel and only pass symbols that
    // actually exist in INTERVAL_POOL (guard against stale state)
    const intervalSymbolsToPass = selectedIntervals
      .filter((s): s is Exclude<IntervalSymbol, "all"> => s !== "all")
      .filter((s) => INTERVAL_POOL.includes(s));

    startSession({
      mode: selectedMode,
      totalQuestions: selectedCount ?? Infinity,
      triadInversions: inversionsToPass,
      triadQualities: qualitiesToPass,
      intervalSymbols: intervalSymbolsToPass,
    });
    router.push("/trainer");
  };

  return (
    <>
      <TopAppBar />

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
            {t.mainMenu.trainingModule}
          </span>
          <h2
            className="text-5xl font-bold leading-tight tracking-tighter text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t.mainMenu.headline} <br />
            <span className="text-[#ffe2ab]">{t.mainMenu.headlineAccent}</span>
          </h2>
          <p className="text-[#bfc7d4] max-w-md font-light leading-relaxed">
            {t.mainMenu.subtitle}
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
              {t.mainMenu.trainingModule}
            </span>
            <h2
              className="text-5xl font-bold leading-tight tracking-tighter text-[#e5e2e1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t.mainMenu.headline} <br />
              <span className="text-[#ffe2ab]">{t.mainMenu.headlineAccent}</span>
            </h2>
            <p className="text-[#bfc7d4] max-w-md font-light leading-relaxed">
              {t.mainMenu.subtitle}
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
            selectedIntervals={selectedIntervals}
            onSelectIntervals={setSelectedIntervals}
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
