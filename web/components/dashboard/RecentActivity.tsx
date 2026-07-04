interface ActivityItem {
  type: string;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

function getTimeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "quiz":
      return (
        <span className="text-sm" role="img" aria-label="quiz">
          &#x2705;
        </span>
      );
    case "srs_review":
      return (
        <span className="text-sm" role="img" aria-label="review">
          &#x1F4DA;
        </span>
      );
    case "lesson_completed":
      return (
        <span className="text-sm" role="img" aria-label="lesson">
          &#x1F393;
        </span>
      );
    default:
      return (
        <span className="text-sm" role="img" aria-label="activity">
          &#x1F4CC;
        </span>
      );
  }
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="font-semibold text-neutral-800 mb-3">Recent Activity</h3>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-400">No activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <ActivityIcon type={item.type} />
              <div className="flex-1 min-w-0">
                <p className="text-neutral-700">{item.description}</p>
                <p className="text-xs text-neutral-400">
                  {getTimeAgo(item.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
