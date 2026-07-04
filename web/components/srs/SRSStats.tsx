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
  /** Optional pre-fetched stats data to avoid duplicate requests */
  data?: SRSStatsData;
}

const STATUSES = [
  { key: "new", label: "New", color: "bg-blue-500" },
  { key: "learning", label: "Learning", color: "bg-amber-500" },
  { key: "reviewing", label: "Reviewing", color: "bg-purple-500" },
  { key: "mastered", label: "Mastered", color: "bg-green-500" },
] as const;

export function SRSStats({ data: externalData }: SRSStatsProps) {
  const { data: fetchedData, isLoading } = useQuery<SRSStatsData>({
    queryKey: ["srs-stats"],
    queryFn: () => api.get("/srs/stats"),
    // Skip fetch if parent already provided data
    enabled: !externalData,
    staleTime: 30_000,
  });

  const stats = externalData || fetchedData;

  if (isLoading && !stats) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-32 bg-neutral-200 rounded" />
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-2 flex-1 bg-neutral-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-sm text-neutral-500 text-center py-4">
        Could not load SRS stats.
      </div>
    );
  }

  // Calculate total for progress bar percentages
  const total =
    stats.new + stats.learning + stats.reviewing + stats.mastered;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-4">
      {/* Due today badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">Spaced Repetition</h3>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          Due today: {stats.total_due_today}
        </span>
      </div>

      {/* Progress bars */}
      <div className="space-y-2">
        {total > 0 ? (
          STATUSES.map((s) => {
            const count = stats[s.key];
            const pct = Math.round((count / total) * 100);
            return (
              <div key={s.key} className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-16 text-right">
                  {s.label}
                </span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 w-8 tabular-nums">
                  {count}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-neutral-400 text-center py-2">
            No cards yet. Complete a lesson to seed your deck.
          </p>
        )}
      </div>
    </div>
  );
}
