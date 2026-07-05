"use client";

import { useMemo } from "react";

interface GrammarContentProps {
  content: string;
}

interface Section {
  title: string;
  body: string;
}

function parseSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split("\n");

  let currentTitle = "";
  let currentBody: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentBody.length > 0 || currentTitle) {
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

  if (currentBody.length > 0 || currentTitle) {
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
  const regex =
    /(\*\*(.+?)\*\*|__(.+?)__|(?<!\*)\*(?!\*)(.+?)\*(?!\*)|(?<!_)_(?!_)(.+?)_(?!_)|`(.+?)`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(<strong key={match.index} style={{ color: "var(--color-text)" }}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<strong key={match.index} style={{ color: "var(--color-text)" }}>{match[3]}</strong>);
    } else if (match[4]) {
      parts.push(<em key={match.index} style={{ color: "var(--color-text-secondary)" }}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(<em key={match.index} style={{ color: "var(--color-text-secondary)" }}>{match[5]}</em>);
    } else if (match[6]) {
      parts.push(
        <code
          key={match.index}
          className="px-1 py-0.5 rounded text-sm font-mono"
          style={{ background: "var(--color-page-bg)", color: "var(--color-active-text)" }}
        >
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

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function isSeparatorRow(line: string): boolean {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .split("|")
    .filter((cell) => cell.trim() !== "")
    .map((cell) => cell.trim());
}

function renderTable(lines: string[]): React.ReactNode {
  const headerCells = parseTableRow(lines[0]);
  const dataRows = lines.slice(1).filter((l) => !isSeparatorRow(l));

  return (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border-collapse text-sm" style={{ borderColor: "var(--color-border)" }}>
        <thead>
          <tr style={{ background: "var(--color-page-bg)" }}>
            {headerCells.map((cell, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri} style={{ background: "var(--color-page-bg)" }}>
              {parseTableRow(row).map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2"
                  style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderBlock(text: string): React.ReactNode {
  const lines = text.split("\n");
  if (
    lines.length >= 2 &&
    isTableRow(lines[0]) &&
    isSeparatorRow(lines[1])
  ) {
    const tableLines: string[] = [];
    for (const line of lines) {
      if (isTableRow(line)) {
        tableLines.push(line);
      } else {
        break;
      }
    }
    return renderTable(tableLines);
  }

  if (text.startsWith("```")) {
    const codeContent = text.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
    return (
      <pre
        className="rounded-xl p-4 overflow-x-auto my-3 text-sm font-mono"
        style={{ background: "var(--color-page-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
      >
        <code>{codeContent}</code>
      </pre>
    );
  }

  return (
    <p className="leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>{renderInline(text)}</p>
  );
}

export function GrammarContent({ content }: GrammarContentProps) {
  const sections = useMemo(() => parseSections(content), [content]);

  if (!content) {
    return (
      <div className="italic" style={{ color: "var(--color-text-muted)" }}>No content available.</div>
    );
  }

  return (
    <div className="max-w-none">
      {sections.map((section, i) => (
        <div key={i} className="mb-6">
          {section.title && (
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>
              {section.title}
            </h2>
          )}
          {section.body
            .split("\n\n")
            .filter((block) => block.trim())
            .map((block, j) => (
              <div key={j}>{renderBlock(block)}</div>
            ))}
        </div>
      ))}
    </div>
  );
}
