/**
 * Canonical Elevation and Shadow Tokens
 * Reference: DeutschFlow Design Bible 01_TOKENS/005_Elevation.md, 006_Shadows.md
 */

export const elevation = {
  "elevation-0": "none",
  "elevation-1": "0 1px 3px rgba(0,0,0,0.2)",
  "elevation-2": "0 4px 12px rgba(0,0,0,0.25)",
  "elevation-3": "0 10px 25px rgba(0,0,0,0.3)",
  "elevation-4": "0 20px 50px rgba(0,0,0,0.4)",
} as const;

export const shadows = {
  "shadow-none": "none",
  "shadow-sm": elevation["elevation-1"],
  "shadow-md": elevation["elevation-2"],
  "shadow-lg": elevation["elevation-3"],
  "shadow-xl": elevation["elevation-4"],
} as const;

export type ElevationToken = keyof typeof elevation;
export type ShadowToken = keyof typeof shadows;
