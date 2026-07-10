"use client";

interface Props {
  levelPct: number;
  streak: number;
  cardsDue: number;
  quizAvg: number;
  weakestCount: number;
}

function Ring({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="progGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#progGradient)" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease", filter: "drop-shadow(0 0 6px rgba(124,58,237,0.3))" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--color-text)" }}>{pct}%</span>
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-0.5" style={{ color: "var(--color-text-muted)" }}>Complete</span>
      </div>
    </div>
  );
}

function Stat({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="text-center">
      <p className="text-xl sm:text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
    </div>
  );
}

export function ProgressOverview({ levelPct, streak, cardsDue, quizAvg, weakestCount }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>
        Your Progress
      </p>
      <div className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
        style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <Ring pct={levelPct} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1 w-full">
          <Stat value={streak} label="Day Streak" color={streak > 0 ? "#f59e0b" : "var(--color-text)"} />
          <Stat value={cardsDue} label="Cards Due" color={cardsDue > 0 ? "#a5b4fc" : "var(--color-text)"} />
          <Stat value={quizAvg > 0 ? `${quizAvg}%` : "—"} label="Quiz Avg" color="var(--color-success)" />
          <Stat value={weakestCount} label="To Practice" color="#f472b6" />
        </div>
      </div>
    </div>
  );
}
