"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrainingMode } from "@/features/main-menu/domain/main-menu.types";

// Only the 3 modules that have tutorials
export type TutorialModule = "intervals" | "closed-triads" | "scales";

const STORAGE_KEYS: Record<TutorialModule, string> = {
  "intervals":     "tutorial_intervals_seen",
  "closed-triads": "tutorial_triads_seen",
  "scales":        "tutorial_scales_seen",
};

function readSeen(module: TutorialModule): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS[module]) === "true";
}

function markSeen(module: TutorialModule): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS[module], "true");
}

/** Returns whether `mode` is a module that has a tutorial */
export function isTutorialModule(mode: TrainingMode): mode is TutorialModule {
  return mode === "intervals" || mode === "closed-triads" || mode === "scales";
}

interface UseTutorialReturn {
  /** Whether the tutorial modal is currently open */
  isOpen: boolean;
  /** True when the tutorial was opened manually (via help button) — hides "don't show again" */
  isManual: boolean;
  /** Open the tutorial for a given module automatically (respects "don't show again") */
  openAuto: (module: TutorialModule) => void;
  /** Open the tutorial for a given module manually (always shows, no "don't show again") */
  openManual: (module: TutorialModule) => void;
  /** Close the tutorial */
  close: () => void;
  /** Close the tutorial and persist "don't show again" */
  closeAndDontShow: () => void;
  /** Current active module */
  activeModule: TutorialModule | null;
}

export function useTutorial(): UseTutorialReturn {
  const [isOpen, setIsOpen]           = useState(false);
  const [isManual, setIsManual]       = useState(false);
  const [activeModule, setActiveModule] = useState<TutorialModule | null>(null);

  const openAuto = useCallback((module: TutorialModule) => {
    if (readSeen(module)) return; // already dismissed — skip
    setActiveModule(module);
    setIsManual(false);
    setIsOpen(true);
  }, []);

  const openManual = useCallback((module: TutorialModule) => {
    setActiveModule(module);
    setIsManual(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const closeAndDontShow = useCallback(() => {
    if (activeModule) markSeen(activeModule);
    setIsOpen(false);
  }, [activeModule]);

  return { isOpen, isManual, openAuto, openManual, close, closeAndDontShow, activeModule };
}
