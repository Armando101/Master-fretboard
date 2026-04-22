import { create } from "zustand";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PitchDetection {
  midi: number;
  clarity: number;
}

export interface PitchStore {
  // ── State ──
  /** Whether the user has this session configured with microphone input */
  isMicEnabled: boolean;
  /** Actively listening for guitar input right now (can be toggled mid-session) */
  isMicListening: boolean;
  /** Most recent successfully detected pitch, null if silent / not yet detected */
  latestDetection: PitchDetection | null;

  // ── Actions ──
  enableMic: () => void;
  disableMic: () => void;
  startListening: () => void;
  stopListening: () => void;
  setDetection: (detection: PitchDetection | null) => void;
  reset: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const usePitchStore = create<PitchStore>((set) => ({
  isMicEnabled: false,
  isMicListening: false,
  latestDetection: null,

  enableMic: () => set({ isMicEnabled: true, isMicListening: true }),
  disableMic: () => set({ isMicEnabled: false, isMicListening: false, latestDetection: null }),

  startListening: () => set({ isMicListening: true }),
  stopListening: () => set({ isMicListening: false }),

  setDetection: (detection) => set({ latestDetection: detection }),

  reset: () => set({ isMicEnabled: false, isMicListening: false, latestDetection: null }),
}));
