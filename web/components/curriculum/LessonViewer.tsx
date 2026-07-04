"use client";

import { useMemo } from "react";

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

  // Push the last section
  if (currentBody.length > 0 || currentTitle !== "Introduction") {
    sections.push({
      title: currentTitle,
      body: currentBody.join("\n").trim(),
    });
  }

  // If no ## headers found, treat the entire content as one section
  if (sections.length === 0 && markdown.trim()) {
    sections.push({ title: "", body: markdown.trim() });
  }

  return sections;
}

function renderParagraphs(text: string): React.ReactNode {
  return text
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p, i) => (
      <p key={i} className="text-neutral-700 leading-relaxed mb-3">
        {renderInline(p)}
      </p>
    ));
}

function renderInline(text: string): React.ReactNode {
  // Bold: **text** or __text__
  // Italic: *text* or _text_
  // Inline code: `text`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|__(.+?)__|(?<!\*)\*(?!\*)(.+?)\*(?!\*)|(?<!_)_(?!_)(.+?)_(?!_)|`(.+?)`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={match.index}>{match[2]}</strong>
      );
    } else if (match[3]) {
      // __bold__
      parts.push(
        <strong key={match.index}>{match[3]}</strong>
      );
    } else if (match[4]) {
      // *italic*
      parts.push(
        <em key={match.index}>{match[4]}</em>
      );
    } else if (match[5]) {
      // _italic_
      parts.push(
        <em key={match.index}>{match[5]}</em>
      );
    } else if (match[6]) {
      // `code`
      parts.push(
        <code
          key={match.index}
          className="bg-neutral-100 px-1 py-0.5 rounded text-sm font-mono text-pink-600"
        >
          {match[6]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function LessonViewer({ content }: LessonViewerProps) {
  const sections = useMemo(() => parseSections(content), [content]);

  if (!content) {
    return (
      <div className="text-neutral-400 italic">
        No lesson content available.
      </div>
    );
  }

  return (
    <div className="prose prose-neutral max-w-none">
      {sections.map((section, i) => (
        <div key={i} className="mb-6">
          {section.title && (
            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
              {section.title}
            </h2>
          )}
          {renderParagraphs(section.body)}
        </div>
      ))}
    </div>
  );
}
