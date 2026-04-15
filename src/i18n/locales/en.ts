import type { Translations } from "./es";

const en: Translations = {
  common: {
    appName: "Guitar Atelier",
    language: "Language",
  },

  mainMenu: {
    trainingModule: "Training Module",
    headline: "Master the",
    headlineAccent: "Fretboard",
    subtitle:
      "Select your focus area and calibrate your session. Technical precision through disciplined repetition in the digital atelier.",

    sessionParams: {
      title: "Session Parameters",
      numberOfQuestions: "Number of Questions",
      inversion: "Inversion",
      quality: "Quality",
      intervalFilter: "Intervals",
      start: "Start",
      selectInversion: "Select inversion",
      selectQuality: "Select quality",
      selectInterval: "Select intervals",
      allLabel: "All",
      comingSoon: "coming soon",
    },

    modes: {
      intervals: {
        title: "Intervals",
        description: "Identify distances between notes across all strings.",
        selectMode: "Select mode",
      },
      closedTriads: {
        title: "Closed Triads",
        description: "Standard major, minor, diminished, and augmented shapes.",
        selectMode: "Select mode",
      },
      scales: {
        title: "Scales",
        description: "Major scale patterns",
        selectMode: "Select mode",
      },
    },

    triadInversions: {
      all: "All",
      fundamental: "Fundamental",
      first: "1st Inversion",
      second: "2nd Inversion",
    },

    triadQualities: {
      all: "All",
      major: "Major",
      minor: "Minor",
      sus2: "Sus2",
      sus4: "Sus4",
      diminished: "Diminished",
      augmented: "Augmented",
    },
  },

  trainer: {
    kinds: {
      scale: "Scale Training",
      triad: "Triad Training",
      interval: "Visual Fretboard Training",
    },
    titles: {
      scale: "Major Scales",
      triad: "Closed Triads",
      interval: "Interval Identification",
    },
    question: {
      label: "Question",
      correct: "correct",
    },
    instructions: {
      scale:
        "Complete the scale on the fretboard starting from the indicated tonic. Select all correct positions and press ",
      triad:
        "Select the 2 remaining notes of the triad (third and fifth) using the indicated tonic as reference. Press ",
      interval:
        "Find the requested interval on the fretboard using the indicated tonic as reference. Select all correct positions and press ",
    },
    headlines: {
      scale: "Major Scale —",
      triad: "Triad",
      interval: "Select an interval of",
    },
    labels: {
      tonic: "Tonic",
      selected: "Selected",
      tuning: "Tuning: Standard (EADGBE)",
    },
    intervalLabels: {
      "2m": "Minor 2nd",
      "2M": "Major 2nd",
      "3m": "Minor 3rd",
      "3M": "Major 3rd",
      "4J": "Perfect 4th",
      "5J": "Perfect 5th",
      "6m": "Minor 6th",
      "6M": "Major 6th",
      "7m": "Minor 7th",
      "7M": "Major 7th",
      "8":  "Octave",
    },
    sessionSnapshot: {
      title: "Your Session",
      hits: "Hits",
      accuracy: "Accuracy",
    },
    banner: {
      correct: "Correct!",
      incorrect: "Incorrect!",
    },
    buttons: {
      verify: "Verify",
      next: "Next question",
      nextShort: "Next",
      finish: "End session",
      finishShort: "End",
    },
    feedback: {
      correctScale: (tonicNote: string, positionLabel: string, scopeLabel: string) =>
        `Correct! You completed the Major scale of ${tonicNote} — ${positionLabel} — ${scopeLabel}.`,
      incorrectScale: (tonicNote: string, positionLabel: string, scopeLabel: string) =>
        `Incorrect. The green positions are the Major scale of ${tonicNote} — ${positionLabel} — ${scopeLabel}.`,
      correctTriad: (qualityLabel: string, tonicNote: string) =>
        `Correct! You found the ${qualityLabel} triad of ${tonicNote}.`,
      incorrectTriad: (qualityLabel: string, tonicNote: string) =>
        `Incorrect. The green positions are the ${qualityLabel} triad of ${tonicNote}.`,
      correctInterval: (intervalSymbol: string, intervalLabel: string, tonicNote: string) =>
        `Correct! You found all positions of the ${intervalSymbol} (${intervalLabel}) interval of ${tonicNote}.`,
      incorrectInterval: (intervalSymbol: string, tonicNote: string) =>
        `Incorrect. The green positions are the correct answers for the ${intervalSymbol} interval of ${tonicNote}.`,
    },
  },

  summary: {
    sessionComplete: "Session Complete",
    greatProgress: "Great Progress.",
    overallAccuracy: "Overall Accuracy",
    correctQuestions: (correct: number, total: number) => `Correct answers: ${correct}/${total}`,
    breakdownInterval: "Interval Breakdown",
    breakdownPosition: "Position Breakdown",
    noResults: "No results yet.",
    newSession: "New session",
    backToMenu: "Back to menu",
    keepPracticing: "Keep practicing!",
    consistencyKey: "Consistency is the key to mastering the fretboard.",
  },
};

export default en;
