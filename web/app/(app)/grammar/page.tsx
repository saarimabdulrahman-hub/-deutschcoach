"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api";
import { GrammarTopicCard } from "@/components/grammar/GrammarTopicCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { getLevelColor } from "@/lib/colors";

const LEVELS = ["All", "A1", "A2", "B1", "B2", "C1"] as const;
const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1"];

interface GrammarTopic {
  id: number; slug: string; title: string; level: string;
  content?: string | null;
  examples?: Record<string, string> | null;
  related_lesson_ids?: number[] | null;
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
          <Skeleton className="h-4 w-16 rounded mb-3" />
          <Skeleton className="h-5 w-3/4 rounded mb-2" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function GrammarPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState<string>("All");
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchTopics = useCallback(async () => {
    setLoading(true); setFetchError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (level !== "All") params.set("level", level);
      const data = await api.get<GrammarTopic[]>(`/grammar?${params.toString()}`);
      setTopics(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load grammar topics.");
      setTopics([]);
    } finally { setLoading(false); }
  }, [debouncedQuery, level]);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  // Group by CEFR level for progression sections (only when "All" and no search)
  const grouped = useMemo(() => {
    if (level !== "All" || debouncedQuery) return null;
    const map: Record<string, GrammarTopic[]> = {};
    for (const t of topics) {
      const lvl = CEFR_ORDER.includes(t.level) ? t.level : "Other";
      if (!map[lvl]) map[lvl] = [];
      map[lvl].push(t);
    }
    return CEFR_ORDER.filter((l) => map[l]?.length).map((l) => ({ level: l, topics: map[l] }));
  }, [topics, level, debouncedQuery]);

  const levelLabel = (lvl: string): string => {
    const map: Record<string, string> = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper Int.", C1: "Advanced" };
    return map[lvl] ?? lvl;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "var(--color-hover-bg)" }}>📖</div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Grammar Library</h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>German grammar, explained by level — from beginner fundamentals to advanced patterns</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <label htmlFor="grammar-search" className="sr-only">Search grammar topics</label>
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input id="grammar-search" type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search grammar topics…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-accent)"; e.target.style.boxShadow = "0 0 0 3px var(--color-active-bg)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {LEVELS.map((lvl) => (
            <button key={lvl} onClick={() => setLevel(lvl)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: level === lvl ? (lvl === "All" ? "var(--color-accent-gradient)" : getLevelColor(lvl)) : "var(--color-card-bg)",
                color: level === lvl ? "#fff" : "var(--color-text-secondary)",
                border: level === lvl ? "none" : "1px solid var(--color-border)",
                boxShadow: level === lvl ? `0 2px 10px ${lvl === "All" ? "var(--color-accent-glow)" : getLevelColor(lvl) + "40"}` : "none",
              }}>{lvl}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? <SkeletonGrid /> : fetchError ? (
        <ErrorState message={fetchError} onRetry={fetchTopics} />
      ) : topics.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
          <p className="text-3xl mb-3">📖</p>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>No grammar topics found</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            {debouncedQuery ? `No topics matching "${debouncedQuery}".` : "No grammar topics available for this level."}
          </p>
        </div>
      ) : grouped ? (
        /* CEFR progression sections */
        <div className="space-y-6">
          {grouped.map(({ level: lvl, topics: groupTopics }) => (
            <section key={lvl} aria-labelledby={`grammar-${lvl}`}>
              <div className="flex items-center gap-2 mb-3">
                <h2 id={`grammar-${lvl}`} className="text-base font-bold" style={{ color: "var(--color-text)" }}>{lvl} · {levelLabel(lvl)}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${getLevelColor(lvl)}18`, color: getLevelColor(lvl) }}>{groupTopics.length} topic{groupTopics.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupTopics.map((topic) => (
                  <GrammarTopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Flat grid (filtered or searched) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic) => (
            <GrammarTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
