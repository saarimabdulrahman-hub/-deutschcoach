"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { GrammarTopicCard } from "@/components/grammar/GrammarTopicCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

const LEVELS = ["All", "A1", "A2", "B1", "B2", "C1"] as const;

interface GrammarTopic {
  id: number;
  slug: string;
  title: string;
  level: string;
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg bg-white animate-pulse"
        >
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/4" />
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

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (level !== "All") params.set("level", level);
      const data = await api.get<GrammarTopic[]>(
        `/grammar?${params.toString()}`
      );
      setTopics(data);
    } catch (err) {
      console.error("Failed to fetch grammar topics:", err);
      setFetchError(err instanceof Error ? err.message : "Failed to load grammar topics.");
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, level]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">
        Grammar Reference
      </h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search grammar topics..."
          className="w-full max-w-md px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Level filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              level === lvl
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <SkeletonGrid />
      ) : fetchError ? (
        <ErrorState
          message={fetchError}
          onRetry={fetchTopics}
        />
      ) : topics.length === 0 ? (
        <EmptyState
          icon="📖"
          title="No grammar topics found"
          description={
            debouncedQuery
              ? `No topics matching "${debouncedQuery}". Try a different search term.`
              : "No grammar topics available for this level."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <GrammarTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
