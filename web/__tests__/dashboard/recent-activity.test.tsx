import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

// ── RecentActivity ────────────────────────────────────────────────────

describe("RecentActivity", () => {
  it("shows empty state when no items", () => {
    render(<RecentActivity items={[]} />);
    expect(screen.getByText("No activity yet. Start learning!")).toBeInTheDocument();
  });

  it("renders activity items", () => {
    const items = [
      { type: "quiz", description: "Quiz — 85% (17/20)", timestamp: new Date().toISOString() },
      { type: "lesson_completed", description: "Completed A1 Greetings", timestamp: new Date(Date.now() - 3600000).toISOString() },
    ];
    render(<RecentActivity items={items} />);
    expect(screen.getByText("Quiz — 85% (17/20)")).toBeInTheDocument();
    expect(screen.getByText("Completed A1 Greetings")).toBeInTheDocument();
  });

  it("shows time ago for timestamps", () => {
    const items = [
      { type: "srs_review", description: "Reviewed 5 cards", timestamp: new Date().toISOString() },
    ];
    render(<RecentActivity items={items} />);
    // "Just now" for a current timestamp
    expect(screen.getByText("Just now")).toBeInTheDocument();
  });

  it("renders correct activity icons", () => {
    const items = [
      { type: "quiz", description: "Quiz", timestamp: new Date().toISOString() },
      { type: "srs_review", description: "SRS", timestamp: new Date().toISOString() },
      { type: "lesson_completed", description: "Lesson", timestamp: new Date().toISOString() },
      { type: "unknown", description: "Other", timestamp: new Date().toISOString() },
    ];
    render(<RecentActivity items={items} />);
    expect(screen.getByText("✅")).toBeInTheDocument();
    expect(screen.getByText("🃏")).toBeInTheDocument();
    expect(screen.getByText("📚")).toBeInTheDocument();
    expect(screen.getByText("📌")).toBeInTheDocument();
  });

  it("renders separators between items", () => {
    const items = [
      { type: "quiz", description: "First", timestamp: new Date().toISOString() },
      { type: "quiz", description: "Second", timestamp: new Date().toISOString() },
    ];
    const { container } = render(<RecentActivity items={items} />);
    // Items should be rendered
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    // Container should have content
    expect(container.querySelectorAll('[class*="py-3"]').length).toBe(2);
  });
});
