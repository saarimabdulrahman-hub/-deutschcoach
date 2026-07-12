"use client";

import { useState } from "react";

// One line of a conversation, as a calm, highly-readable card (Sprint 6.2B).
// The German dominates; speaker/pronunciation are secondary; translation stays
// collapsed and visually separated; audio controls are subtle and UI-only.

export interface DialogueLine {
  id: string | number;
  speaker: string;
  german: string;
  pronunciation?: string;
  translation: string;
  completed?: boolean;
}

interface DialogueCardProps {
  line: DialogueLine;
  tone?: "primary" | "neutral";   // speaker differentiation using existing tokens only
  audioDisabled?: boolean;        // renders the replay/slow controls disabled (UI state)
  onReplay?: (id: DialogueLine["id"]) => void; // UI-only; no real playback in this sprint
  onSlow?: (id: DialogueLine["id"]) => void;   // UI-only
}

const IconReplay = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 9a8 8 0 00-14.9-3M4 15a8 8 0 0014.9 3" />
  </svg>
);

export function DialogueCard({ line, tone = "neutral", audioDisabled, onReplay, onSlow }: DialogueCardProps) {
  const [open, setOpen] = useState(false); // translation collapsed by default
  const initial = line.speaker.trim().charAt(0).toUpperCase() || "?";
  const transId = `dlg-trans-${line.id}`;

  return (
    <article role="listitem" className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--color-card-bg)", opacity: line.completed ? 0.88 : 1 }}>
      <div className="flex gap-3 sm:gap-4">
        {/* Speaker avatar (decorative — name is the accessible label) */}
        <div aria-hidden className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5"
          style={{
            background: tone === "primary" ? "var(--color-hover-bg)" : "var(--color-page-bg)",
            color: tone === "primary" ? "var(--color-accent-light)" : "var(--color-text-muted)",
            border: tone === "primary" ? "none" : "1px solid var(--color-border)",
          }}>
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          {/* Speaker name + subtle audio controls */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider inline-flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
              {line.speaker}
              {line.completed && (<><span aria-hidden style={{ color: "#22c55e" }}>✓</span><span className="sr-only">, read</span></>)}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button type="button" onClick={() => onReplay?.(line.id)} disabled={audioDisabled}
                aria-label={`Replay ${line.speaker}'s line`}
                className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-transform"
                style={{ color: "var(--color-text-muted)" }}><IconReplay /></button>
              <button type="button" onClick={() => onSlow?.(line.id)} disabled={audioDisabled}
                aria-label={`Play ${line.speaker}'s line slowly`}
                className="h-11 min-w-11 px-2 flex items-center justify-center rounded-lg text-[11px] font-bold hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-transform"
                style={{ color: "var(--color-text-muted)" }}>0.5×</button>
            </div>
          </div>

          {/* German — the dominant element */}
          <p className="text-lg sm:text-xl font-medium leading-relaxed" style={{ color: "var(--color-text)" }}>{line.german}</p>

          {/* Pronunciation — subtle, optional */}
          {line.pronunciation && (
            <p className="text-sm italic mt-1" style={{ color: "var(--color-text-muted)" }}>{line.pronunciation}</p>
          )}

          {/* Translation toggle (collapsed by default) */}
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={transId}
            className="mt-2.5 -ml-1 px-1 min-h-[44px] inline-flex items-center gap-1 text-xs font-medium rounded hover:underline"
            style={{ color: "var(--color-accent-light)" }}>
            {open ? "Hide translation" : "Show translation"}
            <span aria-hidden className="inline-block transition-transform duration-150" style={{ transform: open ? "rotate(90deg)" : "none" }}>›</span>
          </button>
          {open && (
            <p id={transId} className="text-sm mt-1 pt-2.5" style={{ color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border)" }}>
              {line.translation}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
