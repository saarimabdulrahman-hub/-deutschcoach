/**
 * Canonical Typography Tokens
 * Reference: DeutschFlow Design Bible 01_TOKENS/002_Typography.md
 */

export const typography = {
  /** 36px — Hero-level large text */
  "type-display-lg": { size: "2.25rem", lineHeight: "1.1", weight: "700" },
  /** 30px — Display headings */
  "type-display-md": { size: "1.875rem", lineHeight: "1.2", weight: "700" },
  /** 24px — Page title / h1 */
  "type-heading-lg": { size: "1.5rem", lineHeight: "1.3", weight: "700" },
  /** 20px — Section headings */
  "type-heading-md": { size: "1.25rem", lineHeight: "1.3", weight: "600" },
  /** 18px — Card section headers */
  "type-heading-sm": { size: "1.125rem", lineHeight: "1.4", weight: "600" },
  /** 16px — Sub-section titles */
  "type-title-md": { size: "1rem", lineHeight: "1.4", weight: "600" },
  /** 14px — Body text, buttons, labels */
  "type-body-md": { size: "0.875rem", lineHeight: "1.5", weight: "400" },
  /** 13px — Small body text */
  "type-body-sm": { size: "0.8125rem", lineHeight: "1.5", weight: "400" },
  /** 12px — UI labels, form labels, captions */
  "type-label-md": { size: "0.75rem", lineHeight: "1.4", weight: "500" },
  /** 11px — Small labels */
  "type-label-sm": { size: "0.6875rem", lineHeight: "1.3", weight: "600" },
  /** 10px — Badges, tab labels */
  "type-caption": { size: "0.625rem", lineHeight: "1.2", weight: "500" },
  /** 14px — Monospace technical text */
  "type-mono-md": { size: "0.875rem", lineHeight: "1.5", weight: "400" },
} as const;

export type TypographyToken = keyof typeof typography;
export type TypographyValue = (typeof typography)[TypographyToken];

/** CSS custom property names for typography tokens */
export const typographyCSSVars = Object.keys(typography).reduce(
  (acc, key) => ({ ...acc, [key]: `var(--${key})` }),
  {} as Record<TypographyToken, string>
);
