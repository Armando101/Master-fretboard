import type { FeedbackState } from "../../domain/trainer.types";

interface FeedbackBannerProps {
  state: FeedbackState;
  message?: string;
}

const CONFIG: Record<
  Exclude<FeedbackState, "idle">,
  {
    bg: string;
    border: string;
    iconBg: string;
    icon: string;
    iconColor: string;
    titleColor: string;
    title: string;
    messageColor: string;
  }
> = {
  correct: {
    bg:           "bg-[#4edea3]/10",
    border:       "border border-[#4edea3]/20",
    iconBg:       "bg-[#4edea3]/20",
    icon:         "task_alt",
    iconColor:    "text-[#4edea3]",
    titleColor:   "text-[#4edea3]",
    title:        "¡Correcto!",
    messageColor: "text-[#4edea3]/80",
  },
  incorrect: {
    bg:           "bg-[#ffb4ab]/10",
    border:       "border border-[#ffb4ab]/20",
    iconBg:       "bg-[#ffb4ab]/20",
    icon:         "cancel",
    iconColor:    "text-[#ffb4ab]",
    titleColor:   "text-[#ffb4ab]",
    title:        "¡Incorrecto!",
    messageColor: "text-[#ffb4ab]/80",
  },
};

export default function FeedbackBanner({ state, message }: FeedbackBannerProps) {
  if (state === "idle") return null;

  const cfg = CONFIG[state];

  return (
    <div className={`flex items-center gap-4 p-4 ${cfg.bg} ${cfg.border} rounded-lg`}>
      <div
        className={`w-10 h-10 rounded-full ${cfg.iconBg} flex items-center justify-center ${cfg.iconColor} shrink-0`}
      >
        <span className="material-symbols-outlined">{cfg.icon}</span>
      </div>
      <div>
        <p
          className={`font-bold ${cfg.titleColor}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {cfg.title}
        </p>
        {message && (
          <p className={`text-xs mt-0.5 ${cfg.messageColor}`}>{message}</p>
        )}
      </div>
    </div>
  );
}
