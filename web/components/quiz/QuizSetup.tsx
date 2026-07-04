"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { QuizSession } from "@/types";

type SourceOption = "current-lesson" | "level" | "weakest";

interface QuizSetupProps {
  onStart: (session: QuizSession) => void;
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

export function QuizSetup({ onStart }: QuizSetupProps) {
  const [source, setSource] = useState<SourceOption>("current-lesson");
  const [level, setLevel] = useState<string>("A1");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = { count };

      if (source === "level") {
        body.level = level;
      }
      // "current-lesson" and "weakest" are handled with no extra params;
      // the backend will pick the best strategy based on user state.

      const session = await api.post<QuizSession>("/quiz/generate", body);
      onStart(session);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate quiz"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-center">Start a Quiz</h2>

      {/* Source selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">
          Source
        </label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as SourceOption)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="current-lesson">Current Lesson</option>
          <option value="level">Specific Level</option>
          <option value="weakest">Weakest Words</option>
        </select>
      </div>

      {/* Level selector (only when source is "level") */}
      {source === "level" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Level
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors
                  ${
                    level === lvl
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-blue-400"
                  }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question count slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 flex items-center justify-between">
          <span>Questions</span>
          <span className="text-neutral-500 font-normal">{count}</span>
        </label>
        <input
          type="range"
          min={5}
          max={30}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-neutral-400">
          <span>5</span>
          <span>30</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Generating...
          </span>
        ) : (
          "Start Quiz"
        )}
      </button>
    </div>
  );
}
