"use client";

import { useInteractionController } from "./useInteractionController";
import { QuestionCard, AnswerOption, FeedbackPanel, HintBox, PageNav } from "./InteractionPrimitives";
import type { InteractionItem } from "./types";

// Multiple-choice exercise (EXERCISE_PATTERN_LIBRARY type 1 — Recognition).
// Presents a question with 3-4 options; the controller tracks the phase.
// Keyboard-accessible: options are buttons; Tab/Arrow + Enter select.

interface Props { items: InteractionItem[]; }

export function RecognitionExercise({ items }: Props) {
  const ctrl = useInteractionController({ mode: "recognition", items });
  const current = ctrl.current;
  const phase = ctrl.phase;
  const isAnswered = phase === "revealed" || phase === "completed";

  if (!items.length) return null;

  return (
    <div className="max-w-lg mx-auto py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
        Choose the answer · {ctrl.index + 1} of {ctrl.total}
      </p>
      <QuestionCard>
        {current.front && <p className="text-base leading-relaxed mb-4" style={{ color: "var(--color-text)" }}>{current.front}</p>}
        <div className="space-y-2">
          {(current.options ?? []).map((opt, i) => {
            const isCorrect = !!current.correct && opt === current.correct;
            const showCorrect = isAnswered && isCorrect;
            return (
              <AnswerOption key={i} correct={showCorrect || undefined}
                onClick={isAnswered ? undefined : () => ctrl.submit()}
                disabled={isAnswered}>
                {opt}
              </AnswerOption>
            );
          })}
        </div>
        <HintBox hint={phase === "hint" ? (current.hint ?? undefined) : undefined} onRequest={!isAnswered && phase !== "hint" ? ctrl.requestHint : undefined} />
      </QuestionCard>
      {isAnswered && current.correct && (
        <FeedbackPanel correct message={`${current.correct} — ${current.back ?? ""}`} onRetry={ctrl.retry} onContinue={ctrl.goNext} />
      )}
      <PageNav current={ctrl.index} total={ctrl.total} onPrev={ctrl.goPrev} onNext={ctrl.goNext} canPrev={ctrl.canGoPrev} canNext={ctrl.canGoNext} />
    </div>
  );
}
