"use client";

import { useEffect, useRef } from "react";

// Leave-lesson confirmation (Sprint 6.2A). Focus-trapped, Esc = keep learning,
// restores focus to the trigger on close. Copy from LESSON_WIREFRAMES Part E.

interface ExitConfirmSheetProps {
  open: boolean;
  onKeep: () => void;
  onLeave: () => void;
}

export function ExitConfirmSheet({ open, onKeep, onLeave }: ExitConfirmSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const keepRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    keepRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onKeep(); return; }
      if (e.key === "Tab" && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>("button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onKeep]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onKeep} aria-hidden />
      <div ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="lesson-exit-title" aria-describedby="lesson-exit-desc"
        className="relative w-full max-w-sm rounded-2xl p-5"
        style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
        <h2 id="lesson-exit-title" className="text-base font-bold" style={{ color: "var(--color-text)" }}>Leave lesson?</h2>
        <p id="lesson-exit-desc" className="text-sm mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
          Your progress is saved — you can pick up right here.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <button onClick={onLeave} className="flex-1 min-h-[44px] px-4 rounded-xl text-sm font-medium"
            style={{ background: "var(--color-card-bg)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
            Leave
          </button>
          <button ref={keepRef} onClick={onKeep} className="flex-1 min-h-[44px] px-4 rounded-xl text-sm font-semibold"
            style={{ background: "var(--color-accent-gradient)", color: "#fff" }}>
            Keep learning
          </button>
        </div>
      </div>
    </div>
  );
}
