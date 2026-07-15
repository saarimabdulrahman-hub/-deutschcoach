/**
 * Canonical Z-Index Tokens
 * Reference: DeutschFlow Design Bible 01_TOKENS/013_Z-Index.md
 * Order (bottom to top): base < dropdown < sticky < overlay < modal < toast < tooltip
 */

export const zIndex = {
  "z-base": 0,
  "z-dropdown": 50,
  "z-sticky": 100,
  "z-overlay": 200,
  "z-modal": 300,
  "z-toast": 400,
  "z-tooltip": 500,
} as const;

export type ZIndexToken = keyof typeof zIndex;
