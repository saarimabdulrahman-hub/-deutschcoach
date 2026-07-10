"use client";

import { useMemo } from "react";
import { useWordSpeech } from "@/hooks/useSpeech";
import { SpeakIcon } from "@/components/ui/SpeakIcon";

interface LessonViewerProps {
  content: string;
}

interface Section {
  title: string;
  body: string;
}

function parseSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split("\n");

  let currentTitle = "Introduction";
  let currentBody: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentBody.length > 0 || currentTitle !== "Introduction") {
        sections.push({
          title: currentTitle,
          body: currentBody.join("\n").trim(),
        });
      }
      currentTitle = line.replace(/^##\s+/, "").trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  if (currentBody.length > 0 || currentTitle !== "Introduction") {
    sections.push({
      title: currentTitle,
      body: currentBody.join("\n").trim(),
    });
  }

  if (sections.length === 0 && markdown.trim()) {
    sections.push({ title: "", body: markdown.trim() });
  }

  return sections;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|__(.+?)__|(?<!\*)\*(?!\*)(.+?)\*(?!\*)|(?<!_)_(?!_)(.+?)_(?!_)|`(.+?)`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(<strong key={match.index} className="font-semibold" style={{ color: "var(--color-text)" }}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<strong key={match.index} className="font-semibold" style={{ color: "var(--color-text)" }}>{match[3]}</strong>);
    } else if (match[4]) {
      parts.push(<em key={match.index} style={{ color: "var(--color-active-text)" }}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(<em key={match.index} style={{ color: "var(--color-active-text)" }}>{match[5]}</em>);
    } else if (match[6]) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: "var(--color-page-bg)", color: "var(--color-active-text)" }}>
          {match[6]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function isDialogue(text: string): boolean {
  const lines = text.split("\n");
  const dialogueLines = lines.filter(
    (l) => l.match(/^[A-Za-z]+:/) || l.match(/^[—–-]\s/) || l.match(/^[""]/)
  );
  return dialogueLines.length >= lines.length * 0.5 && lines.length >= 2;
}

function DialogueBlock({ text }: { text: string }) {
  const { speak, speaking } = useWordSpeech();

  return (
    <div className="my-4 rounded-xl overflow-hidden" style={{ background: "var(--color-hover-bg)", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "var(--color-page-bg)", borderBottom: "1px solid var(--color-border)" }}>
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Dialogue</span>
        <span
          onClick={() => !speaking && speak(text, "de-DE")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") speak(text, "de-DE"); }}
          title="Read aloud"
          style={{ color: "var(--color-text-muted)", cursor: "pointer", opacity: speaking ? 0.3 : 0.6, userSelect: "none" }}
        ><SpeakIcon size={22} /></span>
      </div>
      <div className="p-4 italic leading-relaxed" style={{ borderLeft: "3px solid var(--color-accent)" }}>
        {text.split("\n").map((line, i) => (
          <p key={i} className="mb-1 last:mb-0" style={{ color: "var(--color-text-secondary)" }}>
            {renderInline(line)}
          </p>
        ))}
      </div>
    </div>
  );
}

function renderParagraphs(text: string): React.ReactNode {
  if (isDialogue(text)) {
    return <DialogueBlock text={text} />;
  }

  return text
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p, i) => (
      <p key={i} className="leading-relaxed mb-4 last:mb-0" style={{ color: "var(--color-text-secondary)" }}>
        {renderInline(p)}
      </p>
    ));
}

function SectionHeader({ title, sectionText }: { title: string; sectionText: string }) {
  const { speak, speaking } = useWordSpeech();

  return (
    <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
        {title}
      </h2>
      <span
        onClick={() => !speaking && speak(sectionText, "de-DE")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") speak(sectionText, "de-DE"); }}
        title="Read section aloud"
        style={{ color: "var(--color-text-muted)", cursor: "pointer", opacity: speaking ? 0.3 : 0.6, fontSize: "16px", userSelect: "none" }}
      ><SpeakIcon size={22} /></span>
    </div>
  );
}

export function LessonViewer({ content }: LessonViewerProps) {
  const sections = useMemo(() => parseSections(content), [content]);

  if (!content) {
    return (
      <div className="italic" style={{ color: "var(--color-text-muted)" }}>No lesson content available.</div>
    );
  }

  return (
    <div className="max-w-none prose prose-invert">
      {sections.map((section, i) => (
        <div key={i} className="mb-8 last:mb-0">
          {section.title ? (
            <SectionHeader title={section.title} sectionText={section.body} />
          ) : null}
          {renderParagraphs(section.body)}
        </div>
      ))}
    </div>
  );
}
