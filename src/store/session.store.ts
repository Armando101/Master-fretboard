import { create } from "zustand";
import { generateQuestion, positionsMatch } from "@/lib/music/intervals";
import { generateScaleQuestion } from "@/lib/music/scales";
import { fireConfetti } from "@/lib/confetti";
import type { QuestionData, Position } from "@/lib/music/intervals";
import type { ScaleQuestionData } from "@/lib/music/scales";
import type { TrainingMode, QuestionCount } from "@/features/main-menu/domain/main-menu.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Phase         = "menu" | "training" | "summary";
export type FeedbackState = "idle" | "correct" | "incorrect";
export type SessionType   = "interval" | "scale";

/** Discriminated union — branch on `question.kind` in components. */
export type AnyQuestion = QuestionData | ScaleQuestionData;

export interface SessionConfig {
  mode: TrainingMode;
  sessionType: SessionType;
  totalQuestions: number; // Infinity for unlimited
}

export interface QuestionResult {
  /** Grouping key — intervalSymbol for intervals, position name for scales */
  groupKey: string;
  /** Human-readable group label */
  groupLabel: string;
  wasCorrect: boolean;
}

export interface SessionStore {
  // ── State ──
  phase: Phase;
  config: SessionConfig | null;
  question: AnyQuestion | null;
  selectedPositions: Position[];
  feedbackState: FeedbackState;
  revealedCorrect: Position[];
  revealedIncorrect: Position[];
  currentQuestionIndex: number;
  results: QuestionResult[];

  // ── Actions ──
  startSession: (config: Omit<SessionConfig, "sessionType">) => void;
  selectPosition: (pos: Position) => void;
  deselectPosition: (pos: Position) => void;
  verify: () => void;
  nextQuestion: () => void;
  finishEarly: () => void;
  resetSession: () => void;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function posKey(p: Position) {
  return `${p.string}-${p.fret}`;
}

function makeNextQuestion(sessionType: SessionType): AnyQuestion {
  return sessionType === "scale" ? generateScaleQuestion() : generateQuestion();
}

function makeResult(question: AnyQuestion, wasCorrect: boolean): QuestionResult {
  if (question.kind === "scale") {
    return {
      groupKey:   question.position,
      groupLabel: `${question.positionLabel} — ${question.scopeLabel}`,
      wasCorrect,
    };
  }
  return {
    groupKey:   question.intervalSymbol,
    groupLabel: question.intervalLabel,
    wasCorrect,
  };
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useSessionStore = create<SessionStore>((set, get) => ({
  phase: "menu",
  config: null,
  question: null,
  selectedPositions: [],
  feedbackState: "idle",
  revealedCorrect: [],
  revealedIncorrect: [],
  currentQuestionIndex: 0,
  results: [],

  // ── startSession ──────────────────────────────────────────────────────────
  startSession(partialConfig) {
    const sessionType: SessionType =
      partialConfig.mode === "scales" ? "scale" : "interval";
    const config: SessionConfig = { ...partialConfig, sessionType };
    const question = makeNextQuestion(sessionType);
    set({
      phase: "training",
      config,
      question,
      selectedPositions: [],
      feedbackState: "idle",
      revealedCorrect: [],
      revealedIncorrect: [],
      currentQuestionIndex: 0,
      results: [],
    });
  },

  // ── selectPosition ────────────────────────────────────────────────────────
  selectPosition(pos) {
    const { feedbackState, selectedPositions } = get();
    if (feedbackState !== "idle") return;
    const key = posKey(pos);
    const alreadySelected = selectedPositions.some((p) => posKey(p) === key);
    if (!alreadySelected) {
      set({ selectedPositions: [...selectedPositions, pos] });
    }
  },

  // ── deselectPosition ──────────────────────────────────────────────────────
  deselectPosition(pos) {
    const { feedbackState, selectedPositions } = get();
    if (feedbackState !== "idle") return;
    const key = posKey(pos);
    set({ selectedPositions: selectedPositions.filter((p) => posKey(p) !== key) });
  },

  // ── verify ────────────────────────────────────────────────────────────────
  verify() {
    const { question, selectedPositions, results } = get();
    if (!question || selectedPositions.length === 0) return;

    const correct    = question.correctPositions;
    const isCorrect  = positionsMatch(selectedPositions, correct);
    const correctSet = new Set(correct.map(posKey));

    const revealedCorrect   = correct;
    const revealedIncorrect = selectedPositions.filter((p) => !correctSet.has(posKey(p)));

    if (isCorrect) fireConfetti();

    set({
      feedbackState: isCorrect ? "correct" : "incorrect",
      revealedCorrect,
      revealedIncorrect,
      results: [...results, makeResult(question, isCorrect)],
    });
  },

  // ── nextQuestion ──────────────────────────────────────────────────────────
  nextQuestion() {
    const { config, currentQuestionIndex } = get();
    if (!config) return;

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= config.totalQuestions) {
      set({ phase: "summary" });
      return;
    }

    const nextQuestion = makeNextQuestion(config.sessionType);
    set({
      question: nextQuestion,
      selectedPositions: [],
      feedbackState: "idle",
      revealedCorrect: [],
      revealedIncorrect: [],
      currentQuestionIndex: nextIndex,
    });
  },

  // ── finishEarly ───────────────────────────────────────────────────────────
  finishEarly() {
    set({ phase: "summary" });
  },

  // ── resetSession ──────────────────────────────────────────────────────────
  resetSession() {
    set({
      phase: "menu",
      config: null,
      question: null,
      selectedPositions: [],
      feedbackState: "idle",
      revealedCorrect: [],
      revealedIncorrect: [],
      currentQuestionIndex: 0,
      results: [],
    });
  },
}));
