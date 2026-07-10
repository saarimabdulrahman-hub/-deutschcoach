"use client";

function MiniRing({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
          <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ - (pct / 100) * circ}
            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${color}40)` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color: "var(--color-text)" }}>{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-lg font-bold leading-none" style={{ color: "var(--color-text)" }}>{value}</p>
        <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>{label}</p>
      </div>
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const w = 100, h = 32;
  const pad = 2;
  const step = (w - pad * 2) / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => `${pad + i * step},${h - pad - (v / max) * (h - pad * 2)}`).join(" ");

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
      {values.map((v, i) => (
        <circle key={i} cx={pad + i * step} cy={h - pad - (v / max) * (h - pad * 2)} r="2.5" fill={color} />
      ))}
    </svg>
  );
}

function StreakFlame({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <span className="text-3xl">{days > 0 ? "🔥" : "💤"}</span>
        {days > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{ background: "#f59e0b", color: "#000" }}>{days}</span>
        )}
      </div>
      <div>
        <p className="text-lg font-bold leading-none" style={{ color: days > 0 ? "#f59e0b" : "var(--color-text)" }}>
          {days > 0 ? `${days} day${days !== 1 ? "s" : ""}` : "No streak"}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>
          {days > 0 ? "Keep it up!" : "Start today"}
        </p>
      </div>
    </div>
  );
}

export function ProgressStrip({
  levelPct, cardsDue, quizAvg, streak, activityTypes,
}: {
  levelPct: number;
  cardsDue: number;
  quizAvg: number;
  streak: number;
  activityTypes: string[];
}) {
  // Simulate sparkline data from activity types
  const sparkValues = activityTypes.length > 0
    ? activityTypes.slice(0, 7).map((t) => t === "lesson" ? 4 : t === "review" ? 3 : t === "quiz" ? 2 : 1)
    : [0, 0, 0, 0, 1, 0, 0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Level Progress — ring */}
      <div className="rounded-2xl p-4 sm:p-5 flex items-center justify-center lg:justify-start"
        style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <MiniRing pct={levelPct} color="#a78bfa" label="Level progress" value={`${levelPct}%`} />
      </div>

      {/* Weekly Activity — sparkline */}
      <div className="rounded-2xl p-4 sm:p-5"
        style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>
          Weekly Activity
        </p>
        <div className="flex justify-center">
          {sparkValues.some(v => v > 0) ? (
            <Sparkline values={sparkValues} color="#6366f1" />
          ) : (
            <div className="text-center py-1">
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No data yet —</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>complete a lesson!</p>
            </div>
          )}
        </div>
      </div>

      {/* Streak — flame icon */}
      <div className="rounded-2xl p-4 sm:p-5 flex items-center justify-center lg:justify-start"
        style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <StreakFlame days={streak} />
      </div>

      {/* Cards Due — simple stat with CTA */}
      <div className="rounded-2xl p-4 sm:p-5 flex items-center justify-center lg:justify-start"
        style={{
          background: cardsDue > 0
            ? "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))"
            : "var(--color-card-bg)",
          border: cardsDue > 0 ? "1px solid rgba(99,102,241,0.2)" : "1px solid var(--color-border)",
        }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "rgba(99,102,241,0.12)" }}>
            🃏
          </div>
          <div>
            <p className="text-lg font-bold leading-none" style={{ color: cardsDue > 0 ? "#a5b4fc" : "var(--color-text)" }}>
              {cardsDue}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>
              Cards due
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
