import confetti from "canvas-confetti";

export function fireConfetti(): void {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#9ecaff", "#4edea3", "#ffe2ab"],
  });
}
