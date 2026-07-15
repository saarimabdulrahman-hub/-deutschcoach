/**
 * Canonical Color Token Categories
 * Reference: DeutschFlow Design Bible 01_TOKENS/001_Colors.md
 *
 * Actual color values are set at runtime by ThemeContext.
 * This file defines the canonical token NAMES and categories.
 */
export const colorCategories = [
  "brand-primary",
  "brand-secondary",
  "surface-1",
  "surface-2",
  "surface-3",
  "background-primary",
  "background-secondary",
  "text-primary",
  "text-secondary",
  "text-tertiary",
  "text-muted",
  "border-subtle",
  "border-strong",
  "border-focus",
  "border-divider",
  "success",
  "warning",
  "error",
  "info",
  "accent",
  "accent-light",
  "accent-dark",
  "accent-text",
  "accent-gradient",
  "accent-glow",
] as const;

export type ColorToken = (typeof colorCategories)[number];

/**
 * Semantic color tokens map — used by ThemeContext
 * to map 15 theme palettes to canonical names.
 */
export interface CanonicalColorPalette {
  "--color-brand-primary": string;
  "--color-surface-1": string;
  "--color-surface-2": string;
  "--color-surface-3": string;
  "--color-background-primary": string;
  "--color-background-secondary": string;
  "--color-text-primary": string;
  "--color-text-secondary": string;
  "--color-text-tertiary": string;
  "--color-text-muted": string;
  "--color-border-subtle": string;
  "--color-border-strong": string;
  "--color-border-focus": string;
  "--color-border-divider": string;
  "--color-accent": string;
  "--color-accent-light": string;
  "--color-accent-dark": string;
  "--color-accent-text": string;
  "--color-accent-gradient": string;
  "--color-accent-glow": string;
  "--color-hover-bg": string;
  "--color-active-bg": string;
  "--color-active-text": string;
  "--color-badge-bg": string;
  "--color-badge-text": string;
  "--color-success": string;
  "--color-warning": string;
  "--color-error": string;
  "--color-error-bg": string;
  "--color-error-text": string;
  "--color-error-border": string;
  "--color-info": string;
  "--color-skeleton": string;
}
