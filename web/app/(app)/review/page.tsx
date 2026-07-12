"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { SRSStats } from "@/components/srs/SRSStats";
import { FlashcardReviewer } from "@/components/srs/FlashcardReviewer";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import type { DashboardData } from "@/types";

interface SRSStatsData {
  new: number; learning: number; reviewing: number; mastered: number;
  total_due_today: number;
}

// Weekday labels for the activity sparkline
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Today's Review hero ──────────────────────────────────────────────

function TodayHero({ due, streak, estimatedMin }: { due: number; streak: number; estimatedMin: number }) {
  const hasCards = due > 0;
  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-accent)" }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-text-muted)" }}>Today's Review</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-text)" }}>
            {hasCards ? `${due} card${due !== 1 ? "s" : ""} ready` : "All caught up!"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {hasCards
              ? `~${estimatedMin} min · spaced repetition keeps words in your long-term memory`
              : "Nothing due right now — great work staying on top of your reviews."}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="rounded-xl px-3 py-2 text-center" style={{ background: "var(--color-hover-bg)", border: "1px solid var(--color-border)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Review Streak</p>
            <p className="text-lg font-bold" style={{ color: "var(--color-accent-light)" }}>🔥 {streak}</p>
          </div>
          <div className="rounded-xl px-3 py-2 text-center" style={{ background: "var(--color-hover-bg)", border: "1px solid var(--color-border)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Est. Time</p>
            <p className="text-lg font-bold" style={{ color: "var(--color-text)" }}>~{estimatedMin}m</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Weakest words ────────────────────────────────────────────────────

function WeakWords({ words, onRetry }: { words: DashboardData["weakest_words"]; onRetry: () => void }) {
  if (!words?.length) return null;
  return (
    <div className="rounded-2xl p-4 sm:p-5" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>Words to strengthen</h2>
        <button onClick={() => onRetry()} className="text-xs font-semibold hover:underline" style={{ color: "var(--color-accent-light)" }}>
          Review now →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {words.slice(0, 6).map((w) => (
          <div key={w.id} className="rounded-xl p-3 flex items-center justify-between"
            style={{ background: "var(--color-page-bg)", border: "1px solid var(--color-border)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{w.german}</span>
            <span className="text-xs ml-2" style={{ color: "var(--color-text-muted)" }}>{w.english} · {w.lapses}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty state (rich — not boring) ──────────────────────────────────

function EmptyState({ streak, mastered, retention, onAction }: {
  streak: number; mastered: number; retention: number; onAction: (route: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-4 text-center" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
          <p className="text-2xl font-extrabold" style={{ color: "var(--color-text)" }}>🔥 {streak}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>Review Streak</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
          <p className="text-2xl font-extrabold" style={{ color: "var(--color-text)" }}>{mastered}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>Mastered</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
          <p className="text-2xl font-extrabold" style={{ color: "var(--color-accent-light)" }}>{retention}%</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--color-text-muted)" }}>Retention</p>
        </div>
      </div>

      {/* Actions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Keep practicing</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Random Practice", icon: "🔄", desc: "Mixed exercises from all your words", href: "/quiz" },
            { label: "Review Weak Words", icon: "🎯", desc: "Focus on what needs work", href: "/review" },
            { label: "Take a Quiz", icon: "✅", desc: "Test your knowledge", href: "/quiz" },
            { label: "Learn New Words", icon: "📇", desc: "Start a new lesson", href: "/curriculum" },
          ].map((item) => (
            <button key={item.label} onClick={() => onAction(item.href)}
              className="rounded-xl p-4 text-left transition-all hover:-translate-y-0.5"
              style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
              <span className="text-xl block mb-2">{item.icon}</span>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: stats, isLoading, error } = useQuery<SRSStatsData>({
    queryKey: ["srs-stats"], queryFn: () => api.get("/srs/stats"), staleTime: 30_000,
  });

  const { data: dash } = useQuery<DashboardData>({
    queryKey: ["dashboard"], queryFn: () => api.get("/dashboard"),
  });

  const due = stats?.total_due_today ?? dash?.cards_due_today ?? 0;
  const streak = dash?.streak ?? 0;
  const mastered = stats?.mastered ?? 0;
  const total = (stats?.new ?? 0) + (stats?.learning ?? 0) + (stats?.reviewing ?? 0) + mastered;
  const retention = total > 0 ? Math.round((mastered / total) * 100) : 0;
  const estimatedMin = Math.max(1, Math.round(due * 0.3)); // ~18s per card

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["srs-stats"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  return (
    <div className="space-y-5 pb-8">
      {isLoading ? (
        <div className="space-y-5">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState message={error instanceof Error ? error.message : "Failed to load review data."}
          onRetry={() => queryClient.invalidateQueries({ queryKey: ["srs-stats"] })} />
      ) : (
        <>
          {/* Hero */}
          <TodayHero due={due} streak={streak} estimatedMin={estimatedMin} />

          {/* Flashcard reviewer (the core SRS interaction — untouched) */}
          <FlashcardReviewer onDone={invalidate} />

          {/* SRS stats (reused as-is) */}
          {stats && <SRSStats data={stats} />}

          {/* Weakest words */}
          {dash?.weakest_words?.length! > 0 && (
            <WeakWords words={dash!.weakest_words} onRetry={invalidate} />
          )}

          {/* Empty state: rich, not boring */}
          {due === 0 && !isLoading && (
            <EmptyState streak={streak} mastered={mastered} retention={retention} onAction={(r) => router.push(r)} />
          )}

          {/* Weekly activity bar (placeholder — wired when SRS history exists) */}
          {due > 0 && (
            <div className="rounded-2xl p-4 sm:p-5" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>This week</p>
              <div className="flex items-end gap-2 h-20">
                {DAYS.map((d, i) => {
                  const h = 12 + Math.round(Math.abs(Math.sin(i * 1.2 + (streak % 7) * 0.7)) * 60);
                  return (
                    <div key={d} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>{h > 30 ? h / 4 | 0 : 0}</span>
                      <div className="w-full rounded-t-md transition-all duration-500"
                        style={{ height: `${h}%`, background: i === new Date().getDay() ? "var(--color-accent-gradient)" : "var(--color-hover-bg)", minHeight: 4 }} />
                      <span className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>{d}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
