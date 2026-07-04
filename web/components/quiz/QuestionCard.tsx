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
  "fill-blank": "Fill in the blank",
  conjugate: "Conjugate",
  "multiple-choice": "Multiple choice",
};

export function QuestionCard({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [textValue, setTextValue] = useState("");

  const isMultipleChoice = question.type === "multiple-choice";
  const typeLabel = TYPE_LABELS[question.type] || question.type;

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!textValue.trim()) return;
    onAnswer(textValue.trim());
    setTextValue("");
  }

  function handleOptionClick(option: string) {
    onAnswer(option);
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">
          {questionNumber} of {totalQuestions}
        </span>
        <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          {typeLabel}
        </span>
      </div>

      {/* Question prompt */}
      <div className="text-center">
        <p className="text-lg font-semibold text-neutral-800">
          {question.prompt}
        </p>
        {question.hint && (
          <p className="text-sm text-neutral-400 mt-1 italic">
            Hint: {question.hint}
          </p>
        )}
      </div>

      {/* Multiple choice: option buttons */}
      {isMultipleChoice && question.options && (
        <div className="grid gap-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(option)}
              className="w-full text-left px-4 py-3 rounded-lg border border-neutral-300 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              <span className="text-neutral-400 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Text input for translate / fill-blank / conjugate */}
      {!isMultipleChoice && (
        <form onSubmit={handleTextSubmit} className="flex gap-2">
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Type your answer..."
            autoFocus
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!textValue.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
