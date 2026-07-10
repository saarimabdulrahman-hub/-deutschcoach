// CEFR level color mapping — single source of truth.
// Used by grammar filter pills and topic cards.

const LEVEL_COLORS: Record<string, string> = {
  A1: "var(--color-success)",
  A2: "#3b82f6",
  B1: "var(--color-warning)",
  B2: "#f97316",
  C1: "var(--color-error-text)",
};

export function getLevelColor(level: string): string {
  return LEVEL_COLORS[level] || "var(--color-accent)";
}
