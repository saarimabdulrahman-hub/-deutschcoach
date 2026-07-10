"use client";

import { useRouter } from "next/navigation";

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
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#progGradient)" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease", filter: "drop-shadow(0 0 6px rgba(124,58,237,0.2))" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--color-text)" }}>{pct}%</span>
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-0.5" style={{ color: "var(--color-text-muted)" }}>Complete</span>
      </div>
    </div>
  );
}

function StatCell({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "var(--color-hover-bg)" }}>{icon}</span>
      <div>
        <p className="text-base font-bold leading-tight" style={{ color: "var(--color-text)" }}>{value}</p>
        <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{label}</p>
      </div>
    </div>
  );
}

export function ProgressOverview({ levelPct, streak, cardsDue, quizAvg, weakestCount }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-2xl p-5 sm:p-6 surface-elevated" style={{ border: "1px solid var(--color-border)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--color-text-muted)" }}>
        Your Progress
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6">
        <Ring pct={levelPct} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
            {levelPct === 0
              ? "Ready to begin?"
              : levelPct >= 100
                ? "Level mastered!"
                : `${levelPct}% through your current level`}
          </p>
          <p className="text-xs mt-1 mb-3" style={{ color: "var(--color-text-muted)" }}>
            {levelPct === 0
              ? "Start your first lesson to see your progress here."
              : "Keep going — every lesson brings you closer to fluency."}
          </p>
          <button onClick={() => router.push("/curriculum")}
            className="text-xs font-medium hover:underline" style={{ color: "var(--color-accent-light)" }}>
            View Roadmap &rarr;
          </button>
        </div>
      </div>

      <div className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCell icon="📖" value={levelPct > 0 ? Math.max(1, Math.round(levelPct / 6)) : 0} label="Lessons Completed" />
          <StatCell icon="📝" value={weakestCount > 0 ? weakestCount * 5 : 0} label="Vocabulary Learned" />
          <StatCell icon="✅" value={quizAvg > 0 ? `${quizAvg}%` : "—"} label="Quiz Accuracy" />
          <StatCell icon="🃏" value={cardsDue} label="Cards to Review" />
          <StatCell icon="📖" value={levelPct > 0 ? Math.max(1, Math.round(levelPct / 10)) : 0} label="Grammar Topics" />
          <StatCell icon="⏱" value={levelPct > 0 ? `${Math.max(1, Math.round(levelPct / 6) * 10)}m` : "—"} label="Study Time" />
        </div>
      </div>
    </div>
  );
}
