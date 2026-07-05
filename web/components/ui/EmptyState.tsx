import Link from "next/link";

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--color-hover-bg)" }}>
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>{title}</h3>
      {description && (
        <p className="text-center max-w-sm mb-6" style={{ color: "var(--color-text-muted)" }}>{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "var(--color-accent-gradient)",
            boxShadow: "0 4px 14px var(--color-accent-glow)",
            color: "var(--color-text)",
          }}
        >
          {action.label}
          <span>&rarr;</span>
        </Link>
      )}
    </div>
  );
}
