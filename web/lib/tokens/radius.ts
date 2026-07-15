/**
 * Canonical Radius Tokens
 * Reference: DeutschFlow Design Bible 01_TOKENS/004_Radius.md
 */
export const radius = {
  "radius-xs": "0.5rem",    // 8px — Small badges
  "radius-sm": "0.75rem",   // 12px — Compact controls
  "radius-md": "1rem",      // 16px — Inputs and buttons
  "radius-lg": "1.25rem",   // 20px — Cards
  "radius-xl": "1.5rem",    // 24px — Dialogs
  "radius-pill": "999px",   //  — Pills and chips
} as const;

export type RadiusToken = keyof typeof radius;
export type RadiusValue = (typeof radius)[RadiusToken];
