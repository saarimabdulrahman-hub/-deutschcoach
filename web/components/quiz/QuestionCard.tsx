"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const TYPE_LABELS: Record<string, string> = {
  translate: "Translate",
  "fill-blank": "Fill in the Blank",
  conjugate: "Conjugate",
  "multiple-choice": "Multiple Choice",
};

export function QuestionCard({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [textValue, setTextValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const isMultipleChoice = question.type === "multiple-choice";
  const typeLabel = TYPE_LABELS[question.type] || question.type;

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!textValue.trim()) return;
    onAnswer(textValue.trim());
    setTextValue("");
  }

  function handleOptionClick(option: string) {
    setSelectedOption(option);
    // Small delay to show the selected state before moving on
    setTimeout(() => {
      onAnswer(option);
      setSelectedOption(null);
    }, 300);
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-slide-in">
      {/* Progress dots + type badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i < questionNumber ? "var(--color-accent)" : "var(--color-border)",
                width: i === questionNumber - 1 ? "24px" : "8px",
              }}
            />
          ))}
        </div>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: "var(--color-active-bg)", color: "var(--color-active-text)" }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Question prompt */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-xl font-semibold leading-relaxed" style={{ color: "var(--color-text)" }}>
          {question.prompt}
        </p>
        {question.hint && (
          <p className="text-sm mt-3 italic" style={{ color: "var(--color-text-muted)" }}>
            Hint: {question.hint}
          </p>
        )}
      </div>

      {/* Multiple choice: option cards */}
      {isMultipleChoice && question.options && (
        <div className="grid gap-3">
          {question.options.map((option, i) => {
            const isSelected = selectedOption === option;
            return (
              <button
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected ? "scale-[0.98]" : "hover:scale-[1.01]"
                }`}
                style={{
                  background: isSelected
                    ? "var(--color-active-bg)"
                    : "var(--color-card-bg)",
                  border: `1px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                  color: isSelected ? "var(--color-active-text)" : "var(--color-text)",
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: isSelected ? "var(--color-accent)" : "var(--color-page-bg)",
                      color: isSelected ? "var(--color-text)" : "var(--color-text-muted)",
                      border: `1px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Text input for translate / fill-blank / conjugate */}
      {!isMultipleChoice && (
        <form onSubmit={handleTextSubmit} className="flex gap-3">
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Type your answer..."
            autoFocus
            className="flex-1 rounded-xl px-5 py-4 text-base outline-none transition-all duration-200"
            style={{
              background: "var(--color-card-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-accent)";
              e.target.style.boxShadow = "0 0 0 3px var(--color-active-bg)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-border)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={!textValue.trim()}
            className="px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            style={{
              background: "var(--color-accent-gradient)",
              boxShadow: "0 4px 14px var(--color-accent-glow)",
              color: "var(--color-text)",
            }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
