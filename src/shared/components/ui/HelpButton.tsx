"use client";

interface HelpButtonProps {
  onClick: () => void;
  /** Accent color for the button (inherits from current module) */
  color?: string;
  /** Position variant */
  position?: "fixed-bottom-right" | "inline";
}

export default function HelpButton({
  onClick,
  color = "#9ecaff",
  position = "fixed-bottom-right",
}: HelpButtonProps) {
  return (
    <button
      className={`help-btn ${position === "fixed-bottom-right" ? "help-btn--fixed" : "help-btn--inline"}`}
      onClick={onClick}
      aria-label="Abrir tutorial de ayuda"
      style={{ "--help-color": color } as React.CSSProperties}
    >
      <span className="material-symbols-outlined help-btn__icon">help</span>
      <span className="help-btn__label">Ayuda</span>
    </button>
  );
}
