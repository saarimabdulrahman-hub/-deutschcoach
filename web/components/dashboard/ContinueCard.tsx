"use client";

import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface Props {
  lesson: { id: number; title: string; level: string; unit: number; progress_pct: number } | null;
}

export function ContinueCard({ lesson }: Props) {
  const router = useRouter();

  if (!lesson) {
    return (
      <div className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
        style={{ background: "var(--color-accent-gradient)", color: "#fff" }}>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">Start Learning</p>
          <p className="text-lg sm:text-xl font-bold">Your first German lesson awaits</p>
          <p className="text-sm mt-1 opacity-70">Begin with greetings and introductions — the foundation of conversation</p>
        </div>
        <button
          onClick={() => router.push("/curriculum")}
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
          Browse Lessons &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
      style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
            style={{ background: "var(--color-accent-gradient)", color: "#fff" }}>{lesson.level}</span>
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Unit {lesson.unit}</span>
        </div>
        <p className="text-base sm:text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
          {lesson.title}
        </p>
        <div className="flex items-center gap-4">
          <ProgressBar value={lesson.progress_pct} height="h-1.5" className="max-w-[200px]" />
          <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>{lesson.progress_pct}% done</span>
        </div>
      </div>
      <button
        onClick={() => router.push(`/curriculum/${lesson.level.toLowerCase()}/${lesson.id}`)}
        className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 flex-shrink-0"
        style={{ background: "var(--color-accent-gradient)", color: "#fff", boxShadow: "var(--shadow-glow)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Resume
      </button>
    </div>
  );
}
