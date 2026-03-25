interface ScoreHeroProps {
  correct: number;
  total: number;
}

export default function ScoreHero({ correct, total }: ScoreHeroProps) {
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Headline */}
        <div className="space-y-2">
          <span
            className="text-[#9ecaff] uppercase tracking-[0.2em] text-[10px] font-bold"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Session Complete
          </span>
          <h2
            className="text-5xl font-bold tracking-tight text-[#e5e2e1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Great Progress.
          </h2>
        </div>

        {/* Score card */}
        <div className="bg-[#2a2a2a] p-6 rounded-xl border-l-4 border-[#9ecaff] shrink-0">
          <p className="text-[#89919d] text-xs uppercase tracking-widest mb-1"
             style={{ fontFamily: "'Manrope', sans-serif" }}>
            Overall Accuracy
          </p>
          <p
            className="text-4xl font-bold text-[#9ecaff]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Preguntas correctas: {correct}/{total}
          </p>
        </div>
      </div>
    </section>
  );
}
