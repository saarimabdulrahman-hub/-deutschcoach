import Link from "next/link";

interface GrammarTopicCardProps {
  topic: {
    id: number;
    slug: string;
    title: string;
    level: string;
  };
}

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    A1: "#22c55e",
    A2: "#3b82f6",
    B1: "#f59e0b",
    B2: "#f97316",
    C1: "#ef4444",
  };
  return colors[level] || "#6366f1";
}

export function GrammarTopicCard({ topic }: GrammarTopicCardProps) {
  const accentColor = getLevelColor(topic.level);

  return (
    <Link
      href={`/grammar/${topic.slug}`}
      className="block p-5 rounded-xl transition-all duration-200 group"
      style={{
        background: "var(--color-card-bg)",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accentColor;
        e.currentTarget.style.boxShadow = `0 4px 14px ${accentColor}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-sm leading-snug group-hover:text-indigo-300 transition-colors" style={{ color: "var(--color-text)" }}>
          {topic.title}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5"
          style={{ color: "var(--color-text-muted)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {topic.level}
        </span>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>CEFR</span>
      </div>
    </Link>
  );
}
