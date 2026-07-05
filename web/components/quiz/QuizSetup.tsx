"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { QuizSession } from "@/types";

type SourceOption = "current-lesson" | "level" | "weakest";

interface QuizSetupProps {
  onStart: (session: QuizSession) => void;
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

const SOURCES: { key: SourceOption; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: "current-lesson",
    label: "Current Lesson",
    desc: "Quiz yourself on your active lesson vocabulary",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: "weakest",
    label: "Weak Words",
    desc: "Focus on the words you struggle with most",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: "level",
    label: "By Level",
    desc: "Pick a CEFR level and test your knowledge",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

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
    <div className="max-w-lg mx-auto space-y-6">
      {/* Source selector cards */}
      <div>
        <label className="text-sm font-medium mb-3 block" style={{ color: "var(--color-text-secondary)" }}>Source</label>
        <div className="grid gap-2">
          {SOURCES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSource(s.key)}
              className="flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: source === s.key ? "var(--color-accent)" : "var(--color-card-bg)",
                border: `1px solid ${source === s.key ? "var(--color-accent)" : "var(--color-border)"}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: source === s.key ? "rgba(255,255,255,0.2)" : "var(--color-page-bg)",
                  color: source === s.key ? "#fff" : "var(--color-text-muted)",
                }}
              >
                {s.icon}
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: source === s.key ? "#fff" : "var(--color-text-secondary)" }}>
                  {s.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: source === s.key ? "rgba(255,255,255,0.7)" : "var(--color-text-muted)" }}>{s.desc}</p>
              </div>
              {source === s.key && (
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.3)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" style={{ color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Level selector (only when source is "level") */}
      {source === "level" && (
        <div>
          <label className="text-sm font-medium mb-3 block" style={{ color: "var(--color-text-secondary)" }}>Level</label>
          <div className="flex gap-2">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  level === lvl ? "border-transparent" : ""
                }`}
                style={
                  level === lvl
                    ? {
                        background: "var(--color-accent-gradient)",
                        boxShadow: "0 4px 14px var(--color-accent-glow)",
                        color: "var(--color-text)",
                      }
                    : {
                        background: "var(--color-card-bg)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-secondary)",
                      }
                }
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question count stepper */}
      <div>
        <label className="text-sm font-medium mb-3 block" style={{ color: "var(--color-text-secondary)" }}>Questions</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCount(Math.max(5, count - 5))}
            disabled={count <= 5}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
          >
            &minus;
          </button>
          <div className="flex-1 text-center">
            <span className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>{count}</span>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>questions</p>
          </div>
          <button
            type="button"
            onClick={() => setCount(Math.min(30, count + 5))}
            disabled={count >= 30}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
          >
            +
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm p-4 rounded-xl flex items-center gap-3" style={{ background: "var(--color-error-bg)", border: "1px solid var(--color-error-border)", color: "var(--color-error-text)" }}>
          <span className="text-lg flex-shrink-0">&#9888;</span>
          {error}
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
        style={{
          background: "var(--color-accent-gradient)",
          boxShadow: "0 4px 20px var(--color-accent-glow)",
          color: "var(--color-text)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-text)", borderTopColor: "transparent" }} />
            Generating...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Start Quiz
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
