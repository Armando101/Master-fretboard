import { create } from "zustand";
import { generateQuestion, positionsMatch } from "@/lib/music/intervals";
import { generateScaleQuestion } from "@/lib/music/scales";
import { generateTriadQuestion } from "@/lib/music/triads";
import { fireConfetti } from "@/lib/confetti";
import type { QuestionData, Position } from "@/lib/music/intervals";
import type { ScaleQuestionData } from "@/lib/music/scales";
import type { TriadQuestionData } from "@/lib/music/triads";
import type { TrainingMode } from "@/features/main-menu/domain/main-menu.types";
import type { TriadQuality as MusicTriadQuality, TriadInversion as MusicTriadInversion } from "@/lib/music/triads";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Phase = "menu" | "training" | "summary";
export type FeedbackState = "idle" | "correct" | "incorrect";
export type SessionType = "interval" | "scale" | "triad";

/** Discriminated union — branch on `question.kind` in components. */
export type AnyQuestion = QuestionData | ScaleQuestionData | TriadQuestionData;

export interface SessionConfig {
  mode: TrainingMode;
  sessionType: SessionType;
  totalQuestions: number; // Infinity for unlimited
  triadInversions?: MusicTriadInversion[];
  triadQualities?: MusicTriadQuality[];
  /** Interval symbols to include — undefined/empty means all intervals */
  intervalSymbols?: string[];
  /** Whether this session uses microphone input for note detection */
  useMic?: boolean;
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
  /** Removes the last mic-detected selected position (Undo). Tonic is never removed. */
  undoLastMicNote: () => void;
  /** Removes all selected positions except the tonic (Clear All). */
  clearMicNotes: () => void;
  verify: () => void;
  nextQuestion: () => void;
  finishEarly: () => void;
  resetSession: () => void;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function posKey(p: Position) {
  return `${p.string}-${p.fret}`;
}

function makeNextQuestion(config: SessionConfig): AnyQuestion {
  if (config.sessionType === "scale") return generateScaleQuestion();
  if (config.sessionType === "triad") return generateTriadQuestion(config.triadQualities, config.triadInversions);
  return generateQuestion(config.intervalSymbols);
}

function makeResult(question: AnyQuestion, wasCorrect: boolean): QuestionResult {
  if (question.kind === "scale") {
    return {
      groupKey: question.position,
      groupLabel: `${question.positionLabel} — ${question.scopeLabel}`,
      wasCorrect,
    };
  }
  if (question.kind === "triad") {
    return {
      groupKey: question.quality,
      groupLabel: question.qualityLabel,
      wasCorrect,
    };
  }
  return {
    groupKey: question.intervalSymbol,
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
      partialConfig.mode === "scales" ? "scale" :
        partialConfig.mode === "closed-triads" ? "triad" :
          "interval";
    const config: SessionConfig = { ...partialConfig, sessionType };
    const question = makeNextQuestion(config);
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

  // ── undoLastMicNote ───────────────────────────────────────────────────────
  undoLastMicNote() {
    const { feedbackState, selectedPositions, question } = get();
    if (feedbackState !== "idle" || !question) return;
    const tonicKey = `${question.tonicString}-${question.tonicFret}`;
    // Remove the last selected position that is not the tonic
    const nonTonic = selectedPositions.filter((p) => posKey(p) !== tonicKey);
    if (nonTonic.length === 0) return;
    const lastPos = nonTonic[nonTonic.length - 1];
    set({
      selectedPositions: selectedPositions.filter((p) => posKey(p) !== posKey(lastPos)),
    });
  },

  // ── clearMicNotes ─────────────────────────────────────────────────────────
  clearMicNotes() {
    const { feedbackState, question } = get();
    if (feedbackState !== "idle" || !question) return;
    const tonicKey = `${question.tonicString}-${question.tonicFret}`;
    // Keep only the tonic position
    set({
      selectedPositions: [{ string: question.tonicString, fret: question.tonicFret }].filter(
        () => true // always keep tonic, but only if it was selected
      ),
    });
    // Actually: reset to empty (tonic shown separately as a fixed note)
    set({ selectedPositions: [] });
  },

  // ── verify ────────────────────────────────────────────────────────────────
  verify() {
    const { question, selectedPositions, results } = get();
    if (!question || selectedPositions.length === 0) return;

    const correct = question.correctPositions;
    const isCorrect = positionsMatch(selectedPositions, correct);
    const correctSet = new Set(correct.map(posKey));

    const revealedCorrect = correct;
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

    const nextQuestion = makeNextQuestion(config);
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
