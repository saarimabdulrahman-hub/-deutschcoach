"use client";

import { useState } from "react";
import { useSpeech } from "@/hooks/useSpeech";
import { SpeakIcon } from "@/components/ui/SpeakIcon";

interface VocabCardProps {
  german: string;
  english: string;
  example?: string;
  pos?: string;
}

export function VocabCard({ german, english, example, pos }: VocabCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { speak, speaking } = useSpeech();

  return (
    <div
      className="cursor-pointer select-none perspective-500"
      style={{ minHeight: flipped ? "auto" : "56px" }}
    >
      <div
        className="relative transition-all duration-500 preserve-3d"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          className="p-3 rounded-lg backface-hidden"
          style={{
            background: "var(--color-page-bg)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              onClick={(e) => { e.stopPropagation(); if (!speaking) speak(german, "de-DE"); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); speak(german, "de-DE"); } }}
              title="Listen"
              style={{ color: "var(--color-text-muted)", cursor: "pointer", opacity: speaking ? 0.3 : 0.5, fontSize: "14px", userSelect: "none", flexShrink: 0 }}
            ><SpeakIcon size={22} /></span>
            <div className="flex-1 min-w-0" onClick={() => setFlipped(!flipped)}>
              <div className="flex items-center justify-between">
                <span className="font-semibold truncate" style={{ color: "var(--color-text)" }}>{german}</span>
                {pos && (
                  <span className="text-[10px] uppercase tracking-wider flex-shrink-0 ml-2" style={{ color: "var(--color-text-muted)" }}>
                    {pos}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!flipped && (
            <p className="text-[10px] mt-1 ml-9" style={{ color: "var(--color-text-muted)" }}>Tap card to reveal</p>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 p-3 rounded-lg backface-hidden rotate-y-180"
          style={{
            background: "var(--color-hover-bg)",
            border: "1px solid var(--color-badge-bg)",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="font-semibold text-sm" style={{ color: "var(--color-active-text)" }}>{english}</div>
          {example && (
            <div className="text-xs mt-1.5 leading-snug flex items-start gap-1.5" style={{ color: "var(--color-text-muted)" }}>
              <span className="italic">{example}</span>
              <span
                onClick={(e) => { e.stopPropagation(); if (!speaking) speak(example, "de-DE"); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); speak(example, "de-DE"); } }}
                title="Listen"
                style={{ color: "var(--color-text-muted)", cursor: "pointer", opacity: speaking ? 0.3 : 0.5, fontSize: "12px", userSelect: "none", flexShrink: 0 }}
              ><SpeakIcon size={22} /></span>
            </div>
          )}
          <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>Tap to hide</p>
        </div>
      </div>
    </div>
  );
}
