"use client";

import { useRouter } from "next/navigation";

interface QuizResultItem {
  question_id: string;
  correct: boolean;
  your_answer: string;
  correct_answer: string;
  feedback?: string | null;
}

interface QuizResultOut {
  score_pct: number;
  questions_total: number;
  questions_correct: number;
  results: QuizResultItem[];
}

interface QuizResultsProps {
  results: QuizResultOut;
  onRetry: () => void;
}

function ScoreCircle({ pct }: { pct: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 80 ? "stroke-green-500" : pct >= 50 ? "stroke-amber-500" : "stroke-red-500";

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className={`${color} transition-all duration-700 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(pct)}%</div>
          <div className="text-xs text-neutral-500">Score</div>
        </div>
      </div>
    </div>
  );
}

export function QuizResults({ results, onRetry }: QuizResultsProps) {
  const router = useRouter();

  const wrongCount = results.questions_total - results.questions_correct;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-center">Quiz Complete</h2>

      {/* Score donut */}
      <ScoreCircle pct={results.score_pct} />

      <p className="text-center text-neutral-600">
        {results.questions_correct} of {results.questions_total} correct
        {wrongCount > 0 && (
          <span className="text-red-500"> ({wrongCount} missed)</span>
        )}
      </p>

      {/* Per-question breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-700">Breakdown</h3>
        {results.results.map((item) => (
          <div
            key={item.question_id}
            className={`rounded-lg border p-3 text-sm ${
              item.correct
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5">
                {item.correct ? (
                  <span className="text-green-600 font-bold">&#10003;</span>
                ) : (
                  <span className="text-red-600 font-bold">&#10007;</span>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-800">
                  Your answer:{" "}
                  <span
                    className={item.correct ? "text-green-700" : "text-red-700"}
                  >
                    {item.your_answer || "(no answer)"}
                  </span>
                </p>
                {!item.correct && (
                  <>
                    <p className="text-green-700 mt-1">
                      Correct: {item.correct_answer}
                    </p>
                    {item.feedback && (
                      <p className="text-neutral-500 mt-1 text-xs italic">
                        {item.feedback}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {wrongCount > 0 && (
          <button
            onClick={() => router.push("/review")}
            className="flex-1 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Review Missed Words
          </button>
        )}
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Take Another Quiz
        </button>
      </div>
    </div>
  );
}
