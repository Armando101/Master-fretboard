"use client";

import { useState, useEffect, useCallback, useId } from "react";
import Image from "next/image";
import type { TutorialModule } from "@/shared/hooks/useTutorial";
import type { AnnotationConfig } from "@/shared/data/tutorialData";
import { TUTORIALS } from "@/shared/data/tutorialData";

interface TutorialModalProps {
  isOpen: boolean;
  module: TutorialModule | null;
  isManual?: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  onFinish?: () => void;
}

// ── SVG bezier control point (perpendicular offset from midpoint) ─────────────
function getBezierCP(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature = 12
): [number, number] {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendicular unit vector
  const px = -dy / len;
  const py = dx / len;
  return [mx + px * curvature, my + py * curvature];
}

// ── Annotated image with speech bubble + SVG arrow ───────────────────────────
function AnnotatedImage({
  src,
  alt,
  annotation,
  title,
  description,
  accentColor,
  stepLabel,
}: {
  src: string;
  alt: string;
  annotation: AnnotationConfig;
  title: string;
  description: string;
  accentColor: string;
  stepLabel: string;
}) {
  const uid = useId().replace(/:/g, "");
  const markerId = `arrowhead-${uid}`;

  const { tailX, tailY, targetX, targetY, bubbleX, bubbleY, bubbleWidth = 40 } = annotation;
  const [cpX, cpY] = getBezierCP(tailX, tailY, targetX, targetY);

  // The target dot radius in SVG % space (small circle at tip)
  const dotR = 1.6;

  return (
    <div className="tutorial-annotated-area">
      {/* ── Screenshot ── */}
      <Image
        src={src}
        alt={alt}
        width={1280}
        height={720}
        className="tutorial-screenshot"
        unoptimized
      />

      {/* ── SVG overlay: bezier arrow ── */}
      <svg
        className="tutorial-annotation-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="5"
            markerHeight="5"
            refX="2.5"
            refY="2.5"
            orient="auto-start-reverse"
          >
            <circle cx="2.5" cy="2.5" r="2.5" fill={accentColor} />
          </marker>
          <filter id={`glow-${uid}`}>
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Arrow shaft */}
        <path
          d={`M ${tailX} ${tailY} Q ${cpX} ${cpY} ${targetX} ${targetY}`}
          stroke={accentColor}
          strokeWidth="0.55"
          fill="none"
          strokeLinecap="round"
          markerEnd={`url(#${markerId})`}
          filter={`url(#glow-${uid})`}
          opacity="0.85"
        />

        {/* Pulsing target dot */}
        <circle
          cx={targetX}
          cy={targetY}
          r={dotR}
          fill={accentColor}
          opacity="0.9"
          className="tutorial-target-pulse"
        />
        <circle
          cx={targetX}
          cy={targetY}
          r={dotR * 2.2}
          fill="none"
          stroke={accentColor}
          strokeWidth="0.4"
          opacity="0.4"
          className="tutorial-target-ring"
        />
      </svg>

      {/* ── Speech bubble ── */}
      <div
        className="tutorial-bubble"
        style={{
          left: `${bubbleX}%`,
          top: `${bubbleY}%`,
          maxWidth: `${bubbleWidth}%`,
          borderColor: `${accentColor}45`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.55), 0 0 0 1px ${accentColor}20`,
        }}
      >
        <span
          className="tutorial-bubble-step"
          style={{ color: accentColor }}
        >
          {stepLabel}
        </span>
        <strong className="tutorial-bubble-title">{title}</strong>
        <p
          className="tutorial-bubble-desc"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function TutorialModal({
  isOpen,
  module,
  isManual = false,
  onClose,
  onDontShowAgain,
  onFinish,
}: TutorialModalProps) {
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<"in" | "out-left" | "out-right">("in");

  // Resolve tutorial data (may be null when modal is closed / no module)
  const tutorial = module ? TUTORIALS[module] : null;

  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen, module]);

  // goTo must be declared unconditionally — no early returns before hooks
  const goTo = useCallback(
    (newStep: number, dir: "next" | "prev") => {
      setAnimDir(dir === "next" ? "out-left" : "out-right");
      setTimeout(() => {
        setStep(newStep);
        setAnimDir("in");
      }, 180);
    },
    []
  );

  // Render nothing when closed or no tutorial — AFTER all hooks
  if (!tutorial || !isOpen) return null;

  const totalSteps = tutorial.steps.length;
  const currentStep = tutorial.steps[step];
  const isLast  = step === totalSteps - 1;
  const isFirst = step === 0;
  const accentColor = tutorial.color;

  const handleNext = () => {
    if (isLast) {
      isManual ? onClose() : (onFinish ? onFinish() : onClose());
    } else {
      goTo(step + 1, "next");
    }
  };

  const handlePrev = () => { if (!isFirst) goTo(step - 1, "prev"); };

  const animClass =
    animDir === "out-left"  ? "tut-slide-out-left"  :
    animDir === "out-right" ? "tut-slide-out-right" : "tut-slide-in";

  const stepLabel    = `Paso ${step + 1} de ${totalSteps}`;
  const hasAnnotation = !!(currentStep.image && currentStep.annotation);

  return (
    <div
      className="tutorial-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="tutorial-modal">

        {/* ── Header ── */}
        <div className="tutorial-header">
          <div>
            <span
              className="tutorial-module-badge"
              style={{ background: `${accentColor}18`, color: accentColor }}
            >
              {tutorial.subheadline}
            </span>
            <h2 className="tutorial-headline">{tutorial.headline}</h2>
          </div>
          <button className="tutorial-close-btn" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* ── Content (animated) ── */}
        <div className={`tutorial-content ${animClass}`}>
          {hasAnnotation ? (
            /* Annotated screenshot mode */
            <AnnotatedImage
              src={currentStep.image!}
              alt={currentStep.title}
              annotation={currentStep.annotation!}
              title={currentStep.title}
              description={currentStep.description}
              accentColor={accentColor}
              stepLabel={stepLabel}
            />
          ) : currentStep.image ? (
            /* Plain image + text below */
            <>
              <div className="tutorial-plain-img-wrap">
                <Image
                  src={currentStep.image}
                  alt={currentStep.title}
                  width={1280}
                  height={720}
                  className="tutorial-screenshot"
                  unoptimized
                />
                {currentStep.imageBadge && (
                  <div className={`tutorial-badge tutorial-badge--${currentStep.imageBadge}`}>
                    <span className="material-symbols-outlined">
                      {currentStep.imageBadge === "correct" ? "check_circle" : "cancel"}
                    </span>
                    {currentStep.imageBadge === "correct" ? "Correcto" : "Incorrecto"}
                  </div>
                )}
              </div>
              {currentStep.imageCaption && (
                <p className="tutorial-image-caption">{currentStep.imageCaption}</p>
              )}
              <div className="tutorial-text">
                <span className="tutorial-step-number" style={{ color: accentColor }}>{stepLabel}</span>
                <h3 className="tutorial-step-title">{currentStep.title}</h3>
                <p className="tutorial-step-description" dangerouslySetInnerHTML={{ __html: currentStep.description }} />
              </div>
            </>
          ) : (
            /* No image — text only */
            <div className="tutorial-text-only">
              <span className="material-symbols-outlined tutorial-no-image-icon" style={{ color: accentColor }}>school</span>
              <span className="tutorial-step-number" style={{ color: accentColor }}>{stepLabel}</span>
              <h3 className="tutorial-step-title">{currentStep.title}</h3>
              <p className="tutorial-step-description" dangerouslySetInnerHTML={{ __html: currentStep.description }} />
              {currentStep.imageCaption && (
                <p className="tutorial-image-caption" style={{ textAlign: "center" }}>{currentStep.imageCaption}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Progress dots ── */}
        <div className="tutorial-dots">
          {tutorial.steps.map((_, i) => (
            <button
              key={i}
              className={`tutorial-dot ${i === step ? "tutorial-dot--active" : ""}`}
              style={i === step ? { backgroundColor: accentColor } : {}}
              onClick={() => goTo(i, i > step ? "next" : "prev")}
              aria-label={`Paso ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="tutorial-footer">
          <div className="tutorial-footer-left">
            {!isManual && (
              <button className="tutorial-btn-skip" onClick={onDontShowAgain}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>visibility_off</span>
                No mostrar de nuevo
              </button>
            )}
          </div>
          <div className="tutorial-footer-right">
            <button className="tutorial-btn-prev" onClick={handlePrev} disabled={isFirst}>
              <span className="material-symbols-outlined">arrow_back</span>
              Anterior
            </button>
            <button
              className="tutorial-btn-next"
              style={{ backgroundColor: accentColor }}
              onClick={handleNext}
            >
              {isLast ? (
                <>{isManual ? "Cerrar" : "¡Entendido!"}<span className="material-symbols-outlined">{isManual ? "close" : "play_arrow"}</span></>
              ) : (
                <>Siguiente<span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
