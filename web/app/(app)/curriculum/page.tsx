"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { CurriculumLevel, LessonListItem } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

function LevelAccordion({
  level,
}: {
  level: CurriculumLevel;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const { data: lessons, isLoading } = useQuery<LessonListItem[]>({
    queryKey: ["curriculum", level.level],
    queryFn: () => api.get(`/curriculum/${level.level}`),
    enabled: expanded,
  });

  const progressPct =
    level.lesson_count > 0
      ? Math.round((level.completed_count / level.lesson_count) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-blue-600">{level.level}</span>
          <div>
            <p className="font-semibold text-neutral-800">{level.title}</p>
            <p className="text-xs text-neutral-400">
              {level.completed_count}/{level.lesson_count} lessons completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-24 bg-neutral-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span
            className={`text-sm transform transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          >
            &#8250;
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-neutral-200">
          {isLoading ? (
            <div className="p-4 text-center text-neutral-400">
              Loading lessons...
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() =>
                    router.push(
                      `/curriculum/${level.level.toLowerCase()}/${lesson.id}`
                    )
                  }
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-medium text-neutral-800">
                      {lesson.title}
                    </p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {lesson.topics?.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 bg-neutral-200 rounded-full h-1.5 hidden sm:block">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          lesson.completed ? "bg-green-500 w-full" : "bg-blue-600 w-0"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        lesson.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {lesson.completed ? "Completed" : "Start"}
                    </span>
                  </div>
                </div>
              ))}

              {lessons?.length === 0 && (
                <p className="p-4 text-sm text-neutral-400 text-center">
                  No lessons available for this level.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CurriculumSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

export default function CurriculumPage() {
  const queryClient = useQueryClient();
  const {
    data: levels,
    isLoading,
    error,
  } = useQuery<CurriculumLevel[]>({
    queryKey: ["curriculum"],
    queryFn: () => api.get("/curriculum"),
  });

  if (isLoading) return <CurriculumSkeleton />;
  if (error)
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load curriculum."}
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["curriculum"] })}
      />
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Curriculum</h1>
      <div className="space-y-3">
        {levels?.map((level) => (
          <LevelAccordion key={level.level} level={level} />
        ))}
        {levels?.length === 0 && (
          <EmptyState
            icon="📚"
            title="No lessons available"
            description="There are no curriculum levels available right now. Check back soon for new content!"
          />
        )}
      </div>
    </div>
  );
}
