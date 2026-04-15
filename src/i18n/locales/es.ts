const es = {
  common: {
    appName: "Guitar Atelier",
    language: "Idioma",
  },

  mainMenu: {
    trainingModule: "Módulo de Entrenamiento",
    headline: "Domina el",
    headlineAccent: "Mástil",
    subtitle:
      "Elige tu área de enfoque y calibra tu sesión. Precisión técnica a través de la repetición disciplinada en el atelier digital.",

    sessionParams: {
      title: "Parámetros de Sesión",
      numberOfQuestions: "Número de preguntas",
      inversion: "Inversión",
      quality: "Cualidad",
      start: "Comenzar",
      selectInversion: "Selecciona inversión",
      selectQuality: "Selecciona cualidad",
      allLabel: "Todos",
      comingSoon: "próximamente",
    },

    modes: {
      intervals: {
        title: "Intervalos",
        description: "Identifica distancias entre notas en todas las cuerdas.",
        selectMode: "Seleccionar modo",
      },
      closedTriads: {
        title: "Tríadas Cerradas",
        description: "Acordes mayor, menor, disminuido y aumentado estándar.",
        selectMode: "Seleccionar modo",
      },
      scales: {
        title: "Escalas",
        description: "Patrones de escala mayor",
        selectMode: "Seleccionar modo",
      },
    },

    triadInversions: {
      all: "Todas",
      fundamental: "Fundamental",
      first: "1ra Inversión",
      second: "2da Inversión",
    },

    triadQualities: {
      all: "Todas",
      major: "Mayor",
      minor: "Menor",
      sus2: "Sus2",
      sus4: "Sus4",
      diminished: "Disminuido",
      augmented: "Aumentado",
    },
  },

  trainer: {
    kinds: {
      scale: "Entrenamiento de Escalas",
      triad: "Entrenamiento de Tríadas",
      interval: "Entrenamiento Visual de Mástil",
    },
    titles: {
      scale: "Escalas Mayores",
      triad: "Tríadas Cerradas",
      interval: "Identificación de Intervalos",
    },
    question: {
      label: "Pregunta",
      correct: "correctas",
    },
    instructions: {
      scale:
        "Completa la escala en el mástil partiendo de la tónica indicada. Selecciona todas las posiciones correctas y presiona ",
      triad:
        "Selecciona las 2 notas restantes de la tríada (tercera y quinta) tomando como referencia la tónica indicada. Presiona ",
      interval:
        "Localiza el intervalo solicitado en el mástil tomando como referencia la tónica indicada. Selecciona todas las posiciones correctas y presiona ",
    },
    headlines: {
      scale: "Escala Mayor —",
      triad: "Tríada",
      interval: "Selecciona un intervalo de",
    },
    labels: {
      tonic: "Tónica",
      selected: "Seleccionada",
      tuning: "Afinación: Estándar (EADGBE)",
    },
    intervalLabels: {
      "2m": "Segunda menor",
      "2M": "Segunda mayor",
      "3m": "Tercera menor",
      "3M": "Tercera mayor",
      "4J": "Cuarta justa",
      "5J": "Quinta justa",
      "6m": "Sexta menor",
      "6M": "Sexta mayor",
      "7m": "Séptima menor",
      "7M": "Séptima mayor",
      "8":  "Octava",
    },
    sessionSnapshot: {
      title: "Tu Sesión",
      hits: "Aciertos",
      accuracy: "Precisión",
    },
    banner: {
      correct: "¡Correcto!",
      incorrect: "¡Incorrecto!",
    },
    buttons: {
      verify: "Verificar",
      next: "Siguiente pregunta",
      nextShort: "Siguiente",
      finish: "Terminar sesión",
      finishShort: "Terminar",
    },
    feedback: {
      correctScale: (tonicNote: string, positionLabel: string, scopeLabel: string) =>
        `¡Correcto! Completaste la escala Mayor de ${tonicNote} — ${positionLabel} — ${scopeLabel}.`,
      incorrectScale: (tonicNote: string, positionLabel: string, scopeLabel: string) =>
        `Incorrecto. Las posiciones en verde son la escala Mayor de ${tonicNote} — ${positionLabel} — ${scopeLabel}.`,
      correctTriad: (qualityLabel: string, tonicNote: string) =>
        `¡Correcto! Localizaste la tríada ${qualityLabel} de ${tonicNote}.`,
      incorrectTriad: (qualityLabel: string, tonicNote: string) =>
        `Incorrecto. Las posiciones en verde son la tríada ${qualityLabel} de ${tonicNote}.`,
      correctInterval: (intervalSymbol: string, intervalLabel: string, tonicNote: string) =>
        `¡Correcto! Localizaste todas las posiciones del intervalo ${intervalSymbol} (${intervalLabel}) de ${tonicNote}.`,
      incorrectInterval: (intervalSymbol: string, tonicNote: string) =>
        `Incorrecto. Las posiciones en verde son las respuestas correctas del intervalo ${intervalSymbol} de ${tonicNote}.`,
    },
  },

  summary: {
    sessionComplete: "Sesión completa",
    greatProgress: "Gran Progreso.",
    overallAccuracy: "Precisión general",
    correctQuestions: (correct: number, total: number) => `Preguntas correctas: ${correct}/${total}`,
    breakdownInterval: "Desglose por Intervalo",
    breakdownPosition: "Desglose por Posición",
    noResults: "No hay resultados.",
    newSession: "Nueva sesión",
    backToMenu: "Volver al menú",
    keepPracticing: "¡Sigue practicando!",
    consistencyKey: "La consistencia es la clave para dominar el mástil.",
  },
} as const;

// Derive the public Translations type with all string leaves widened to `string`
// so that other locale files can assign any string value (not just the ES literals).
type DeepWidenStrings<T> = T extends (...args: infer A) => string
  ? (...args: A) => string
  : T extends string
  ? string
  : T extends object
  ? { [K in keyof T]: DeepWidenStrings<T[K]> }
  : T;

export type Translations = DeepWidenStrings<typeof es>;
export default es;
