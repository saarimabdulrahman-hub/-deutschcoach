/**
 * Canonical Motion Tokens
 * Reference: DeutschFlow Design Bible 01_TOKENS/008_Motion.md
 * Principles: 06_MOTION_AND_MICROINTERACTIONS/001_Motion_Principles.md
 */

export const durations = {
  "duration-fast": "100ms",
  "duration-normal": "200ms",
  "duration-slow": "350ms",
} as const;

export const easings = {
  "easing-standard": "ease-out",
  "easing-decelerate": "cubic-bezier(0, 0, 0.2, 1)",
  "easing-accelerate": "cubic-bezier(0.4, 0, 1, 1)",
  "easing-emphasized": "cubic-bezier(0.4, 0, 0.2, 1.5)",
} as const;

export type DurationToken = keyof typeof durations;
export type EasingToken = keyof typeof easings;

/** Recommended durations per interaction type */
export const interactionDurations = {
  hover: durations["duration-fast"],          // 100ms
  buttonPress: durations["duration-fast"],     // 100ms
  dropdown: "150ms",                           // 150-220ms
  dialogEnter: "200ms",                        // 180-250ms
  dialogExit: "150ms",
  pageTransition: "250ms",                     // 200-350ms
  skeletonShimmer: "1.5s",
} as const;
