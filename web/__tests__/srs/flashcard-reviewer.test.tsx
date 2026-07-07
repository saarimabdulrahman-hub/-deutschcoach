import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlashcardReviewer } from "@/components/srs/FlashcardReviewer";

// Mock the API module
vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { api } from "@/lib/api";

function mockDueCards(cards: Array<Partial<{
  id: number;
  german: string;
  english: string;
  status: string;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
}>>) {
  (api.get as ReturnType<typeof vi.fn>).mockResolvedValue(
    cards.map((c, i) => ({
      id: c.id ?? i + 1,
      vocab_entry: {
        id: c.id ?? i + 1,
        german: c.german ?? "Haus",
        english: c.english ?? "house",
        example_sentence: "Das Haus ist groß.",
        part_of_speech: "noun",
      },
      status: c.status ?? "new",
      easiness_factor: c.easiness_factor ?? 2.5,
      interval_days: c.interval_days ?? 0,
      repetitions: c.repetitions ?? 0,
      lapses: c.lapses ?? 0,
    }))
  );
}

describe("FlashcardReviewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    (api.get as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {})); // never resolves
    render(<FlashcardReviewer />);
    // Should show some loading indicator or skeleton
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows empty state when no cards due", async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<FlashcardReviewer />);
    await waitFor(() => {
      expect(screen.getByText("All caught up!")).toBeInTheDocument();
    });
  });

  it("shows front of card with German word", async () => {
    mockDueCards([{ german: "der Hund", english: "dog", status: "new" }]);
    render(<FlashcardReviewer />);
    await waitFor(() => {
      expect(screen.getByText("der Hund")).toBeInTheDocument();
    });
  });

  it("shows rating buttons after flipping card", async () => {
    mockDueCards([{ german: "die Katze", english: "cat", status: "new" }]);
    render(<FlashcardReviewer />);
    await waitFor(() => {
      expect(screen.getByText("die Katze")).toBeInTheDocument();
    });
    // Card is unflipped — rating buttons not yet visible
    expect(screen.queryByText("Blackout")).not.toBeInTheDocument();
    // Click the card to flip it
    await userEvent.click(screen.getByText("die Katze"));
    // Now rating buttons should appear
    expect(screen.getByText("Blackout")).toBeInTheDocument();
    expect(screen.getByText("Wrong")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Easy")).toBeInTheDocument();
  });
});
