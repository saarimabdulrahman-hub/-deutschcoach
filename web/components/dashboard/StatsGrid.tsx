import type { DashboardData } from "@deutschcoach/shared/types";

interface StatsGridProps {
  data: DashboardData;
}

export function StatsGrid({ data }: StatsGridProps) {
  const cards = [
    {
      label: "Streak",
      value: `${data.streak}`,
      unit: "days",
      emoji: "🔥",
    },
    {
      label: "Cards Due",
      value: `${data.cards_due_today}`,
      unit: "",
      emoji: "🃏",
    },
    {
      label: "Quiz Avg",
      value: `${data.avg_quiz_score}`,
      unit: "%",
      emoji: "✅",
    },
    {
      label: "Progress",
      value: `${data.level_progress_pct}`,
      unit: "%",
      emoji: "📊",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <span>{card.emoji}</span>
            <span>{card.label}</span>
          </div>
          <div className="text-2xl font-bold">
            {card.value}
            {card.unit && (
              <span className="text-sm font-normal text-neutral-400 ml-0.5">
                {card.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
