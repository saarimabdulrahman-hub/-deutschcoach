"use client";
import { useRouter } from "next/navigation";

interface ContinueLesson {
  id: number;
  title: string;
  level: string;
  unit: number;
  progress_pct: number;
}

export function ContinueLearning({ lesson }: { lesson: ContinueLesson }) {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col justify-between"
      style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium" style={{ color: "var(--color-active-text)" }}>📚 Continue Learning</span>
          <span className="text-xs px-2 py-0.5 rounded-md font-semibold" style={{ background: "var(--color-badge-bg)", color: "var(--color-badge-text)" }}>
            {lesson.level}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1" style={{ color: "var(--color-text)" }}>{lesson.title}</h3>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Unit {lesson.unit}</p>

        <div className="mt-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: "var(--color-text-muted)" }}>Progress</span>
            <span style={{ color: "var(--color-text-secondary)" }}>{lesson.progress_pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--color-page-bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${lesson.progress_pct}%`, background: "var(--color-accent-gradient)" }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push(`/curriculum/${lesson.level.toLowerCase()}/${lesson.id}`)}
        className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={{ background: "var(--color-accent-gradient)", color: "#fff", boxShadow: "var(--color-accent-glow)" }}
      >
        Resume Lesson →
      </button>
    </div>
  );
}
