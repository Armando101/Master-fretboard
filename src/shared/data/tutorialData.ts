import type { TutorialModule } from "@/shared/hooks/useTutorial";

export interface AnnotationConfig {
  /** Bubble top-left corner, as % of image dimensions */
  bubbleX: number;
  bubbleY: number;
  /** Max width of bubble, % of image width (default 40) */
  bubbleWidth?: number;
  /** Arrow tail start point on the bubble edge (% of image) */
  tailX: number;
  tailY: number;
  /** Arrow tip — what we're pointing at (% of image) */
  targetX: number;
  targetY: number;
}

export interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  /** When annotation is set, title+desc appear as a speech bubble ON the image */
  annotation?: AnnotationConfig;
  /** Only used for non-annotated steps */
  imageBadge?: "correct" | "incorrect";
  imageCaption?: string;
}

export interface TutorialData {
  module: TutorialModule;
  headline: string;
  subheadline: string;
  color: string;
  steps: TutorialStep[];
}

export const TUTORIALS: Record<TutorialModule, TutorialData> = {
  /* ─────────────── INTERVALS ─────────────── */
  intervals: {
    module: "intervals",
    headline: "Identificación de Intervalos",
    subheadline: "Tutorial · 4 pasos",
    color: "#9ecaff",
    steps: [
      {
        title: "Elige el modo Intervalos",
        description:
          "Selecciona la tarjeta <strong>Intervalos</strong> y presiona <strong>Comenzar</strong>. Cada ejercicio te pedirá identificar un intervalo en el mástil.",
        image: "/tutorials/menu-overview.png",
        annotation: {
          bubbleX: 2, bubbleY: 2, bubbleWidth: 40,
          tailX: 40, tailY: 20,
          targetX: 56, targetY: 32,
        },
      },
      {
        title: "La Tónica (punto azul)",
        description:
          "El punto <strong>azul</strong> es la tónica — tu nota de referencia. Debes encontrar el intervalo solicitado tomando esta nota como punto de partida.",
        image: "/tutorials/intervals-tonic.png",
        annotation: {
          bubbleX: 2, bubbleY: 3, bubbleWidth: 38,
          tailX: 36, tailY: 22,
          targetX: 67, targetY: 74,
        },
      },
      {
        title: "Selecciona en ambos lados",
        description:
          "El intervalo existe en <strong>múltiples posiciones</strong>. Debes seleccionar <strong>todas</strong> las ocurrencias — a la izquierda y derecha de la tónica. Seleccionar solo un lado es incorrecto.",
        image: "/tutorials/intervals-selected.png",
        annotation: {
          bubbleX: 50, bubbleY: 2, bubbleWidth: 44,
          tailX: 52, tailY: 22,
          targetX: 45, targetY: 38,
        },
      },
      {
        title: "Verifica tu respuesta",
        description:
          "Cuando hayas marcado todas las posiciones, presiona <strong>Verificar</strong>. Las notas correctas aparecen en verde y las equivocadas en rojo.",
        image: "/tutorials/intervals-feedback.png",
        annotation: {
          bubbleX: 38, bubbleY: 3, bubbleWidth: 44,
          tailX: 40, tailY: 25,
          targetX: 18, targetY: 64,
        },
      },
    ],
  },

  /* ─────────────── TRIADS ─────────────── */
  "closed-triads": {
    module: "closed-triads",
    headline: "Tríadas Cerradas",
    subheadline: "Tutorial · 4 pasos",
    color: "#ffe2ab",
    steps: [
      {
        title: "Elige Tríadas Cerradas",
        description:
          "Selecciona la tarjeta <strong>Tríadas Cerradas</strong>. Puedes filtrar por <strong>inversión</strong> (fundamental, 1ª, 2ª) y <strong>calidad</strong> (mayor, menor, etc.) antes de comenzar.",
        image: "/tutorials/menu-overview.png",
        annotation: {
          bubbleX: 2, bubbleY: 2, bubbleWidth: 40,
          tailX: 75, tailY: 18,
          targetX: 88, targetY: 28,
        },
      },
      {
        title: "La Tónica (punto azul)",
        description:
          "El punto <strong>azul</strong> es la raíz del acorde. La cabecera muestra el tipo de tríada y la inversión. Debes encontrar las <strong>2 notas restantes</strong> de la tríada.",
        image: "/tutorials/triads-tonic.png",
        annotation: {
          // Blue D dot at fret 12, string 3 — approx 65%, 54% of 1440x800 img
          bubbleX: 2, bubbleY: 3, bubbleWidth: 40,
          tailX: 56, tailY: 32,
          targetX: 64, targetY: 54,
        },
      },
      {
        title: "Selecciona las 2 notas contiguas",
        description:
          "Las notas de la tríada cerrada están en <strong>3 cuerdas consecutivas</strong>. Selecciona la tercera y quinta del acorde en cuerdas adyacentes a la tónica. No uses cuerdas alejadas.",
        image: "/tutorials/triads-selected.png",
        annotation: {
          // Two selected dots near tonic — upper dots at ~65%, 46% and ~69%, 40%
          bubbleX: 2, bubbleY: 3, bubbleWidth: 42,
          tailX: 56, tailY: 28,
          targetX: 65, targetY: 46,
        },
      },
      {
        title: "Verifica la tríada",
        description:
          "Cuando hayas seleccionado las 3 notas, presiona <strong>Verificar</strong>. Verde = correcto, rojo = nota equivocada o faltante.",
        image: "/tutorials/triads-selected.png",
        annotation: {
          // Verificar button in left panel at ~21%, 56%
          bubbleX: 38, bubbleY: 3, bubbleWidth: 44,
          tailX: 40, tailY: 26,
          targetX: 21, targetY: 56,
        },
      },
    ],
  },

  /* ─────────────── SCALES ─────────────── */
  scales: {
    module: "scales",
    headline: "Escalas Mayores",
    subheadline: "Tutorial · 4 pasos",
    color: "#4edea3",
    steps: [
      {
        title: "Elige el modo Escalas",
        description:
          "Selecciona la tarjeta <strong>Escalas</strong> y presiona Comenzar. Cada ejercicio pedirá un patrón de escala mayor en una posición específica del mástil.",
        image: "/tutorials/menu-overview.png",
        annotation: {
          bubbleX: 2, bubbleY: 2, bubbleWidth: 40,
          tailX: 40, tailY: 42,
          targetX: 56, targetY: 68,
        },
      },
      {
        title: "Lee la cabecera: posición y alcance",
        description:
          "La cabecera indica <strong>posición</strong> (Izquierda / Derecha / Centro) y <strong>alcance</strong> (Cuerdas Restantes / 8va). Esto define qué parte del patrón debes tocar.",
        image: "/tutorials/scales-tonic.png",
        annotation: {
          // Headline "Escala Mayor — Derecha (Cuerdas Restantes)" at ~55%, 17%
          bubbleX: 2, bubbleY: 35, bubbleWidth: 42,
          tailX: 52, tailY: 40,
          targetX: 72, targetY: 17,
        },
      },
      {
        title: "La Tónica (punto azul)",
        description:
          "El punto <strong>azul</strong> es la tónica — nota de referencia. Debes seleccionar todas las notas del patrón de escala <strong>partiendo desde ella</strong> según la posición indicada.",
        image: "/tutorials/scales-tonic.png",
        annotation: {
          // Blue G dot at fret 3, string 6 (low E) — approx 19%, 66%
          bubbleX: 22, bubbleY: 3, bubbleWidth: 44,
          tailX: 24, tailY: 60,
          targetX: 19, targetY: 66,
        },
      },
      {
        title: "Selecciona y verifica",
        description:
          "Marca <strong>todas y solo</strong> las notas del patrón para la posición indicada. Luego presiona <strong>Verificar</strong>. Verde = correcto, rojo = nota equivocada o faltante.",
        image: "/tutorials/scales-selected.png",
        annotation: {
          // Verificar button in left panel at ~21%, 56%
          bubbleX: 38, bubbleY: 3, bubbleWidth: 44,
          tailX: 40, tailY: 26,
          targetX: 21, targetY: 56,
        },
      },
    ],
  },

};
