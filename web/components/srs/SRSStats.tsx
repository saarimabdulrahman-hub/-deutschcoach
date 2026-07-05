"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SRSStatsData {
  new: number;
  learning: number;
  reviewing: number;
  mastered: number;
  total_due_today: number;
}

interface SRSStatsProps {
  data?: SRSStatsData;
}

const STATUSES = [
  { key: "new" as const, label: "New", color: "var(--color-accent)", icon: "●" },
  { key: "learning" as const, label: "Learning", color: "var(--color-warning)", icon: "◉" },
  { key: "reviewing" as const, label: "Reviewing", color: "var(--color-accent-dark)", icon: "◈" },
  { key: "mastered" as const, label: "Mastered", color: "var(--color-success)", icon: "◆" },
];

export function SRSStats({ data: externalData }: SRSStatsProps) {
  const { data: fetchedData, isLoading } = useQuery<SRSStatsData>({
    queryKey: ["srs-stats"],
    queryFn: () => api.get("/srs/stats"),
    enabled: !externalData,
    staleTime: 30_000,
  });

  const stats = externalData || fetchedData;

  if (isLoading && !stats) {
    return (
      <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <div className="shimmer h-4 w-32 rounded" />
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-2 flex-1 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <p style={{ color: "var(--color-text-muted)" }} className="text-sm">Could not load SRS stats.</p>
      </div>
    );
  }

  const total = stats.new + stats.learning + stats.reviewing + stats.mastered;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Spaced Repetition</h3>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "var(--color-active-bg)", color: "var(--color-active-text)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {stats.total_due_today} due today
        </span>
      </div>

      {total > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {STATUSES.map((s) => {
            const count = stats[s.key];
            const pct = Math.round((count / total) * 100);
            return (
              <div key={s.key} className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>{count}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span style={{ color: s.color, fontSize: "8px" }}>{s.icon}</span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.label}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-page-bg)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: s.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-center py-4" style={{ color: "var(--color-text-muted)" }}>
          No cards yet. Complete a lesson to seed your deck.
        </p>
      )}
    </div>
  );
}
