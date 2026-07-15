/**
 * DeutschCoach Canonical Design Tokens
 *
 * Single source of truth for all visual values.
 * Reference: DeutschFlow Design Bible v8.5.1
 *
 * Every component must reference these tokens — never raw values.
 */

export { spacing } from "./spacing";
export type { SpacingToken, SpacingValue } from "./spacing";

export { radius } from "./radius";
export type { RadiusToken, RadiusValue } from "./radius";

export { colorCategories } from "./colors";
export type { ColorToken, CanonicalColorPalette } from "./colors";

export { typography } from "./typography";
export type { TypographyToken, TypographyValue } from "./typography";

export { elevation, shadows } from "./elevation";
export type { ElevationToken, ShadowToken } from "./elevation";

export { durations, easings, interactionDurations } from "./motion";
export type { DurationToken, EasingToken } from "./motion";

export { zIndex } from "./z-index";
export type { ZIndexToken } from "./z-index";

export { gradients } from "./gradients";
export type { GradientToken } from "./gradients";
