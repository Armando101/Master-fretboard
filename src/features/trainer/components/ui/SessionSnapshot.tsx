"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import type { SessionStats } from "../../domain/trainer.types";

interface SessionSnapshotProps {
  stats: SessionStats;
}

export default function SessionSnapshot({ stats }: SessionSnapshotProps) {
  const { t } = useLanguage();
  const ss = t.trainer.sessionSnapshot;
  const accuracy =
    stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);

  return (
    <section className="bg-[#1c1b1b] p-6 rounded-xl">
      <h3
        className="font-bold text-[#e5e2e1] mb-4"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {ss.title}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#20201f] p-4 rounded-lg">
          <p className="text-[10px] uppercase tracking-widest text-[#bfc7d4] mb-1">
            {ss.hits}
          </p>
          <p
            className="text-2xl text-[#4edea3]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {stats.correct}
          </p>
        </div>
        <div className="bg-[#20201f] p-4 rounded-lg">
          <p className="text-[10px] uppercase tracking-widest text-[#bfc7d4] mb-1">
            {ss.accuracy}
          </p>
          <p
            className="text-2xl text-[#9ecaff]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {accuracy}%
          </p>
        </div>
      </div>
    </section>
  );
}
