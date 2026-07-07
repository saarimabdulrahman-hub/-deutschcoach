import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuizResults } from "@/components/quiz/QuizResults";

function makeResults(overrides: Partial<{
  score_pct: number;
  total: number;
  correct: number;
  results: Array<{
    question_id: string;
    correct: boolean;
    your_answer: string;
    correct_answer: string;
    feedback?: string | null;
  }>;
}> = {}) {
  return {
    score_pct: overrides.score_pct ?? 85,
    questions_total: overrides.total ?? 20,
    questions_correct: overrides.correct ?? 17,
    results: overrides.results ?? [
      { question_id: "1", correct: true, your_answer: "Haus", correct_answer: "Haus", feedback: null },
      { question_id: "2", correct: false, your_answer: "gehn", correct_answer: "gehen", feedback: "Remember the -en ending" },
    ],
  };
}

describe("QuizResults", () => {
  it("renders score percentage", () => {
    const { container } = render(
      <QuizResults results={makeResults({ score_pct: 85 })} onRetry={vi.fn()} />
    );
    // Should show the score number somewhere in the SVG or text
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("shows questions correct out of total", () => {
    render(
      <QuizResults results={makeResults({ total: 20, correct: 17 })} onRetry={vi.fn()} />
    );
    // The component shows this info
    expect(screen.getByText(/17/)).toBeInTheDocument();
    expect(screen.getByText(/20/)).toBeInTheDocument();
  });

  it("calls onRetry when 'Another Quiz' button clicked", async () => {
    const onRetry = vi.fn();
    render(
      <QuizResults results={makeResults()} onRetry={onRetry} />
    );
    const retryBtn = screen.getByText("Another Quiz");
    await userEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders perfect score correctly", () => {
    render(
      <QuizResults results={makeResults({ score_pct: 100, total: 10, correct: 10 })} onRetry={vi.fn()} />
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("renders failing score correctly", () => {
    render(
      <QuizResults results={makeResults({ score_pct: 30, total: 10, correct: 3 })} onRetry={vi.fn()} />
    );
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("shows wrong answers in breakdown", async () => {
    render(
      <QuizResults
        results={makeResults({
          score_pct: 50,
          total: 2,
          correct: 1,
          results: [
            { question_id: "1", correct: true, your_answer: "Haus", correct_answer: "Haus" },
            { question_id: "2", correct: false, your_answer: "gehn", correct_answer: "gehen", feedback: "Remember the -en ending" },
          ],
        })}
        onRetry={vi.fn()}
      />
    );
    // Wrong answer accordion is visible showing the user's answer
    expect(screen.getByText(/Your answer: gehn/)).toBeInTheDocument();
    // Click to expand the accordion
    await userEvent.click(screen.getByText(/Your answer: gehn/));
    // Correct answer should now be visible
    expect(screen.getByText("Correct: gehen")).toBeInTheDocument();
  });
});
