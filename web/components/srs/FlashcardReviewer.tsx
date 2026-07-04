"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface SRSCard {
  id: number;
  vocab_entry: {
    id: number;
    german: string;
    english: string;
    example_sentence?: string | null;
    part_of_speech?: string | null;
  };
  status: string;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
}

interface SRSStatsData {
  new: number;
  learning: number;
  reviewing: number;
  mastered: number;
  total_due_today: number;
}

const RATING_LABELS = [
  { value: 0, label: "Blackout", color: "bg-red-600" },
  { value: 1, label: "Wrong", color: "bg-red-500" },
  { value: 2, label: "Almost", color: "bg-orange-500" },
  { value: 3, label: "Hard", color: "bg-yellow-500" },
  { value: 4, label: "Good", color: "bg-green-500" },
  { value: 5, label: "Easy", color: "bg-green-600" },
];

interface FlashcardReviewerProps {
  /** Called when review completes with updated stats */
  onDone?: (stats: SRSStatsData) => void;
}

export function FlashcardReviewer({ onDone }: FlashcardReviewerProps) {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    setLoading(true);
    try {
      const data = await api.get<SRSCard[]>("/srs/due");
      setCards(data);
      setCurrentIndex(0);
      setFlipped(false);
      setDone(data.length === 0);
    } catch {
      // Cards will remain empty — UI shows error state via done + empty cards
      setCards([]);
      setDone(true);
    }
    setLoading(false);
  }

  async function handleRate(rating: number) {
    const card = cards[currentIndex];
    await api.post("/srs/review", { card_id: card.id, rating });

    if (currentIndex + 1 >= cards.length) {
      setDone(true);
      // Refresh stats so parent can update counts
      try {
        const stats = await api.get<SRSStatsData>("/srs/stats");
        onDone?.(stats);
      } catch {
        // Stats refresh is best-effort
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-neutral-500">Loading cards...</p>
      </div>
    );
  }

  if (done && cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">&#127881;</div>
        <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
        <p className="text-neutral-500">No cards due right now.</p>
        <button
          onClick={loadCards}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Check Again
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">&#127881;</div>
        <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
        <p className="text-neutral-500">
          You reviewed {cards.length} card{cards.length !== 1 ? "s" : ""}.
        </p>
        <button
          onClick={loadCards}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Check Again
        </button>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="text-sm text-neutral-500 mb-4">
        {currentIndex + 1} of {cards.length}
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(true)}
        className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer min-h-[200px] flex flex-col items-center justify-center select-none"
      >
        <div className="text-3xl font-bold mb-2">
          {card.vocab_entry.german}
        </div>
        {card.vocab_entry.part_of_speech && (
          <div className="text-xs text-neutral-400 uppercase tracking-wide">
            {card.vocab_entry.part_of_speech}
          </div>
        )}

        {flipped && (
          <div className="mt-4 pt-4 border-t w-full">
            <div className="text-xl text-blue-600 font-semibold">
              {card.vocab_entry.english}
            </div>
            {card.vocab_entry.example_sentence && (
              <div className="text-sm text-neutral-500 mt-2 italic">
                {card.vocab_entry.example_sentence}
              </div>
            )}
            <div className="text-xs text-neutral-400 mt-2">
              Interval: {card.interval_days}d &middot; Ease:{" "}
              {card.easiness_factor.toFixed(1)} &middot; Reps:{" "}
              {card.repetitions}
            </div>
          </div>
        )}
      </div>

      {!flipped && (
        <p className="text-center text-neutral-400 text-sm mt-4">
          Tap card to reveal
        </p>
      )}

      {/* Rating buttons */}
      {flipped && (
        <div className="grid grid-cols-6 gap-2 mt-4">
          {RATING_LABELS.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRate(r.value)}
              className={`${r.color} text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
            >
              <div>{r.value}</div>
              <div className="text-xs opacity-80">{r.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
