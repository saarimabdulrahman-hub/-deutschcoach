import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CardSkeleton, PageSkeleton } from "@/components/ui/Skeleton";
import { Logo } from "@/components/ui/Logo";
import { SpeakIcon } from "@/components/ui/SpeakIcon";
import userEvent from "@testing-library/user-event";

// ── EmptyState ────────────────────────────────────────────────────────

describe("EmptyState", () => {
  it("renders title and icon", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("📭")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="Empty" description="Nothing to see here" />);
    expect(screen.getByText("Nothing to see here")).toBeInTheDocument();
  });

  it("renders action link when provided", () => {
    render(
      <EmptyState
        title="No lessons"
        action={{ label: "Go to lessons", href: "/curriculum" }}
      />
    );
    const link = screen.getByText("Go to lessons");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/curriculum");
  });

  it("does not render action when not provided", () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

// ── ErrorState ────────────────────────────────────────────────────────

describe("ErrorState", () => {
  it("renders default message when none provided", () => {
    render(<ErrorState />);
    expect(screen.getByText("Failed to load data.")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<ErrorState message="Custom error occurred" />);
    expect(screen.getByText("Custom error occurred")).toBeInTheDocument();
  });

  it("renders retry button when onRetry provided", () => {
    render(<ErrorState message="Error" onRetry={() => {}} />);
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("calls onRetry when button clicked", async () => {
    let called = false;
    render(<ErrorState message="Error" onRetry={() => { called = true; }} />);
    await userEvent.click(screen.getByText("Try Again"));
    expect(called).toBe(true);
  });

  it("does not render retry button when onRetry not provided", () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByText("Try Again")).not.toBeInTheDocument();
  });
});

// ── Skeleton ──────────────────────────────────────────────────────────

describe("Skeleton", () => {
  it("CardSkeleton renders without crashing", () => {
    const { container } = render(<CardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("PageSkeleton renders correct number of cards", () => {
    const { container } = render(<PageSkeleton cards={3} />);
    // Each card has border class, plus wrapper
    const cards = container.querySelectorAll('[class*="rounded-xl"]');
    expect(cards.length).toBe(3);
  });

  it("PageSkeleton defaults to 3 cards", () => {
    const { container } = render(<PageSkeleton />);
    const cards = container.querySelectorAll('[class*="rounded-xl"]');
    expect(cards.length).toBe(3);
  });
});

// ── Logo ──────────────────────────────────────────────────────────────

describe("Logo", () => {
  it("renders an SVG logo", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 48 48");
  });

  it("renders with different sizes", () => {
    const { container } = render(<Logo size={60} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("60");
    expect(svg?.getAttribute("height")).toBe("60");
  });
});

// ── SpeakIcon ─────────────────────────────────────────────────────────

describe("SpeakIcon", () => {
  it("renders an SVG icon", () => {
    const { container } = render(<SpeakIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("renders at custom size", () => {
    const { container } = render(<SpeakIcon size={32} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
  });
});
