import { create } from "zustand";
import { generateQuestion, positionsMatch } from "@/lib/music/intervals";
import { fireConfetti } from "@/lib/confetti";
import type { QuestionData, Position } from "@/lib/music/intervals";
import type { TrainingMode, QuestionCount } from "@/features/main-menu/domain/main-menu.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Phase = "menu" | "training" | "summary";
export type FeedbackState = "idle" | "correct" | "incorrect";

export interface SessionConfig {
  mode: TrainingMode;
  totalQuestions: number; // Infinity for unlimited
}

export interface QuestionResult {
  intervalSymbol: string;
  intervalLabel: string;
  wasCorrect: boolean;
}

export interface SessionStore {
  // ── State ──
  phase: Phase;
  config: SessionConfig | null;
  question: QuestionData | null;
  selectedPositions: Position[];
  feedbackState: FeedbackState;
  /** Positions revealed after verify: correct ones (green) */
  revealedCorrect: Position[];
  /** Positions revealed after verify: incorrect ones selected by user (red) */
  revealedIncorrect: Position[];
  currentQuestionIndex: number;
  results: QuestionResult[];

  // ── Actions ──
  startSession: (config: SessionConfig) => void;
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
  startSession(config) {
    const question = generateQuestion();
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
    if (feedbackState !== "idle") return; // locked after verify

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
    const { question, selectedPositions, currentQuestionIndex, results } = get();
    if (!question || selectedPositions.length === 0) return;

    const correct = question.correctPositions;
    const isCorrect = positionsMatch(selectedPositions, correct);

    // Classify selected positions
    const correctSet = new Set(correct.map(posKey));
    const revealedCorrect = correct; // always show all correct
    const revealedIncorrect = selectedPositions.filter(
      (p) => !correctSet.has(posKey(p))
    );

    const newResult: QuestionResult = {
      intervalSymbol: question.intervalSymbol,
      intervalLabel: question.intervalLabel,
      wasCorrect: isCorrect,
    };

    if (isCorrect) {
      fireConfetti();
    }

    set({
      feedbackState: isCorrect ? "correct" : "incorrect",
      revealedCorrect,
      revealedIncorrect,
      results: [...results, newResult],
      currentQuestionIndex: currentQuestionIndex,
    });
  },

  // ── nextQuestion ──────────────────────────────────────────────────────────
  nextQuestion() {
    const { config, currentQuestionIndex, results } = get();
    if (!config) return;

    const nextIndex = currentQuestionIndex + 1;

    // Check if session is complete
    if (nextIndex >= config.totalQuestions) {
      // Session done → summary
      set({ phase: "summary" });
      return;
    }

    const nextQuestion = generateQuestion();
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
