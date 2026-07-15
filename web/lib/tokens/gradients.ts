/**
 * Canonical Gradient Tokens
 * Reference: DeutschFlow Design Bible 01_TOKENS/012_Gradients.md
 *
 * These are preset gradient strings. The actual color values
 * adapt to the active theme via CSS variables.
 */

export const gradients = {
  "gradient-brand-primary": "linear-gradient(135deg, var(--color-accent-dark), var(--color-accent))",
  "gradient-hero": "linear-gradient(135deg, var(--color-accent-light), var(--color-accent-dark))",
  "gradient-accent": "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
  "gradient-overlay": "linear-gradient(180deg, transparent, rgba(0,0,0,0.4))",
  /** Synthwave neon default */
  "gradient-neon": "linear-gradient(135deg, #ec4899, #d946ef, #8b5cf6)",
} as const;

export type GradientToken = keyof typeof gradients;
