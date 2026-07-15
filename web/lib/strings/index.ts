/**
 * DeutschFlow Copy Library — Centralized string constants
 *
 * Single source of truth for all user-facing text.
 * Follows DeutschFlow Design Bible 10_CONTENT_AND_COPYWRITING_SYSTEM.
 *
 * Usage:
 *   import { auth } from "@/lib/strings";
 *   <h1>{auth.login.title}</h1>
 *
 * Localization:
 *   Ready for i18n — create web/lib/strings/{locale}/auth.ts to override.
 *   Plurals handled via pluralize() from "./shared".
 */

export { auth } from "./auth";
export { dashboard } from "./dashboard";
export { chat } from "./chat";
export { learning } from "./learning";
export { errors } from "./errors";
export { empty } from "./empty";
export { notifications } from "./notifications";
export { pluralize, interpolate } from "./shared";
