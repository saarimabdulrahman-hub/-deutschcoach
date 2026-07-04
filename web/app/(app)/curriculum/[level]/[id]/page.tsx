"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { LessonDetail } from "@/types";
import { LessonViewer } from "@/components/curriculum/LessonViewer";
import { VocabCard } from "@/components/curriculum/VocabCard";

function LessonSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-neutral-200 rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-12 bg-neutral-200 rounded" />
        <div className="h-6 w-16 bg-neutral-200 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-5/6" />
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams<{ level: string; id: string }>();
  const router = useRouter();
  const level = params.level;
  const id = params.id;

  const { data, isLoading, error } = useQuery<LessonDetail>({
    queryKey: ["lesson", level, id],
    queryFn: () => api.get(`/curriculum/${level}/${id}`),
    enabled: !!level && !!id,
  });

  const seedMutation = useMutation({
    mutationFn: () =>
      api.post("/srs/seed-lesson", { lesson_id: parseInt(id) }),
    onSuccess: () => {
      router.push("/quiz");
    },
  });

  if (isLoading) return <LessonSkeleton />;
  if (error || !data)
    return (
      <div className="text-red-500">Failed to load lesson</div>
    );

  const { lesson, vocabulary, exercises } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
            {lesson.level}
          </span>
          <span className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
            Unit {lesson.unit}
          </span>
        </div>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-neutral-500 mt-1">{lesson.description}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <LessonViewer content={lesson.content || ""} />
          </div>

          {/* Exercises */}
          {exercises && exercises.length > 0 && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Exercises</h2>
              <div className="space-y-4">
                {exercises.map((ex, i) => {
                  const question = typeof ex.question === "string" ? ex.question : "";
                  const answer = typeof ex.answer === "string" ? ex.answer : "";
                  const exType = typeof ex.type === "string" ? ex.type : "";
                  return (
                    <div
                      key={i}
                      className="p-4 border border-neutral-200 rounded-lg"
                    >
                      <p className="text-sm font-medium text-neutral-500 mb-2">
                        Exercise {i + 1}
                        {exType ? ` — ${exType}` : ""}
                      </p>
                      {question ? (
                        <p className="text-neutral-800 mb-2">{question}</p>
                      ) : null}
                      {answer ? (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 font-medium">
                            Show answer
                          </summary>
                          <p className="mt-2 text-neutral-600">{answer}</p>
                        </details>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Vocabulary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">
              Vocabulary ({vocabulary.length})
            </h2>
            {vocabulary.length === 0 ? (
              <p className="text-sm text-neutral-400">
                No vocabulary for this lesson.
              </p>
            ) : (
              <div className="space-y-2">
                {vocabulary.map((v) => (
                  <VocabCard
                    key={v.id}
                    german={v.german}
                    english={v.english}
                    example={v.example_sentence || undefined}
                    pos={v.part_of_speech || undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Lesson button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => seedMutation.mutate()}
          disabled={seedMutation.isPending}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {seedMutation.isPending
            ? "Seeding vocabulary..."
            : "Complete Lesson & Review"}
        </button>
      </div>
      {seedMutation.isError && (
        <p className="text-red-500 text-center text-sm">
          {(seedMutation.error as Error).message || "Failed to complete lesson"}
        </p>
      )}
    </div>
  );
}
