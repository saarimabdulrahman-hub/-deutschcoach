"use client";

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--color-error-bg)" }}>
        <span className="text-4xl">&#9888;</span>
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>Something went wrong</h3>
      <p className="text-center max-w-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
        {message || "Failed to load data."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "var(--color-accent-gradient)",
            boxShadow: "0 4px 14px var(--color-accent-glow)",
            color: "var(--color-text)",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
