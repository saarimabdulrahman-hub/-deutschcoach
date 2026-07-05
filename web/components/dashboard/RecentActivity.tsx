interface ActivityItem { type: string; description: string; timestamp: string; }

function getTimeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getActivityIcon(type: string): string {
  if (type === "quiz") return "✅";
  if (type === "srs_review") return "🃏";
  if (type === "lesson_completed") return "📚";
  return "📌";
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-muted)" }}>📋 Recent Activity</h3>
      {items.length === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: "var(--color-text-muted)" }}>No activity yet. Start learning!</p>
      ) : (
        <div className="space-y-0">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <span className="text-base flex-shrink-0">{getActivityIcon(item.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--color-text-secondary)" }}>{item.description}</p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>{getTimeAgo(item.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
