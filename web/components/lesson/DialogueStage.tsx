"use client";

import { LessonShell, type LessonStep } from "./LessonShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { DialogueCard, type DialogueLine } from "./DialogueCard";

// The Dialogue stage (Sprint 6.2B): renders the conversation INSIDE the existing
// LessonShell (6.2A). It owns only the content slot — the shell provides the
// header, progress and sticky CTA. Fully props-driven; no hardcoded dialogue.

export type { DialogueLine };

interface DialogueStageProps {
  // Shell configuration (forwarded — no layout logic duplicated)
  lessonTitle: string;
  steps: LessonStep[];
  currentStep: number;
  onBack?: () => void;
  onExit?: () => void;
  confirmExit?: boolean;
  onContinue: () => void;
  continueLabel?: string;

  // Dialogue content
  sceneTitle: string;
  sceneDescription?: string;
  guidance?: string;
  lines: DialogueLine[];

  // States
  loading?: boolean;
  error?: { message?: string; onRetry?: () => void } | null;

  // Audio (UI-only this sprint)
  audioDisabled?: boolean;
  onReplayLine?: (id: DialogueLine["id"]) => void;
  onSlowLine?: (id: DialogueLine["id"]) => void;
}

const DEFAULT_GUIDANCE = "Listen to each line, then reveal the English if you need it.";

export function DialogueStage({
  lessonTitle, steps, currentStep, onBack, onExit, confirmExit, onContinue, continueLabel = "Continue",
  sceneTitle, sceneDescription, guidance = DEFAULT_GUIDANCE, lines,
  loading, error, audioDisabled, onReplayLine, onSlowLine,
}: DialogueStageProps) {
  // Stable tone per unique speaker (alternating), derived from the data — no hardcoded names.
  const speakerOrder: string[] = [];
  for (const l of lines) if (!speakerOrder.includes(l.speaker)) speakerOrder.push(l.speaker);
  const toneFor = (speaker: string): "primary" | "neutral" =>
    speakerOrder.indexOf(speaker) % 2 === 0 ? "primary" : "neutral";

  return (
    <LessonShell
      title={lessonTitle}
      steps={steps}
      currentStep={currentStep}
      onBack={onBack}
      onExit={onExit}
      confirmExit={confirmExit}
      error={error}
      primaryAction={{ label: continueLabel, onClick: onContinue, disabled: loading || !!error }}
    >
      {/* Comfortable reading column + bottom room so the sticky CTA never overlaps the last line */}
      <div className="max-w-2xl mx-auto pb-24">
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>{sceneTitle}</h2>
        {sceneDescription && <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{sceneDescription}</p>}
        {guidance && <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>{guidance}</p>}

        <div role="list" aria-label="Conversation" className="space-y-3 sm:space-y-4 mt-5">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl p-4 sm:p-5" style={{ background: "var(--color-card-bg)" }} aria-hidden>
                  <div className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2 pt-1">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-5 w-3/4 rounded" />
                    </div>
                  </div>
                </div>
              ))
            : lines.map((line) => (
                <DialogueCard key={line.id} line={line} tone={toneFor(line.speaker)}
                  audioDisabled={audioDisabled} onReplay={onReplayLine} onSlow={onSlowLine} />
              ))}
        </div>
      </div>
    </LessonShell>
  );
}
