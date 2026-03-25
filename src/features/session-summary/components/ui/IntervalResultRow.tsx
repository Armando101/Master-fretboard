import type { IntervalResult } from "../../domain/session-summary.types";
import { getResultTone } from "../../domain/session-summary.types";

interface IntervalResultRowProps {
  result: IntervalResult;
}

const TONE_STYLES = {
  success: {
    rowBorder: "",
    iconBg: "bg-[#4edea3]/10",
    icon: "check_circle",
    iconStyle: { fontVariationSettings: "'FILL' 1" },
    iconColor: "text-[#4edea3]",
    scoreColor: "text-[#4edea3]",
    barColor: "bg-[#4edea3]",
  },
  failure: {
    rowBorder: "border-l-2 border-[#ffb4ab]/30",
    iconBg: "bg-[#ffb4ab]/10",
    icon: "cancel",
    iconStyle: { fontVariationSettings: "'FILL' 1" },
    iconColor: "text-[#ffb4ab]",
    scoreColor: "text-[#ffb4ab]",
    barColor: "bg-[#ffb4ab]",
  },
  partial: {
    rowBorder: "",
    iconBg: "bg-[#9ecaff]/10",
    icon: "info",
    iconStyle: { fontVariationSettings: "'FILL' 1" },
    iconColor: "text-[#9ecaff]",
    scoreColor: "text-[#bfc7d4]",
    barColor: "bg-[#9ecaff]",
  },
};

export default function IntervalResultRow({ result }: IntervalResultRowProps) {
  const { symbol, label, correct, total } = result;
  const tone = getResultTone(correct, total);
  const styles = TONE_STYLES[tone];
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);

  return (
    <div
      className={[
        "bg-[#1c1b1b] p-5 rounded-lg flex items-center justify-between",
        "transition-colors hover:bg-[#20201f]",
        styles.rowBorder,
      ].join(" ")}
    >
      {/* Left: icon + label */}
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}
        >
          <span
            className={`material-symbols-outlined ${styles.iconColor}`}
            style={styles.iconStyle}
          >
            {styles.icon}
          </span>
        </div>
        <div>
          <p
            className="text-xl font-bold text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {symbol}
          </p>
          <p className="text-xs text-[#89919d] uppercase tracking-wider"
             style={{ fontFamily: "'Manrope', sans-serif" }}>
            {label}
          </p>
        </div>
      </div>

      {/* Right: fraction + progress bar */}
      <div className="text-right">
        <p
          className={`text-2xl font-bold ${styles.scoreColor}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {correct}/{total}
        </p>
        <div className="w-24 h-1 bg-[#353535] rounded-full mt-1 overflow-hidden">
          <div
            className={`${styles.barColor} h-full rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
