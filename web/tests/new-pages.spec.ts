/**
 * Smoke tests for all new Phase 2 pages
 */
import { test, expect } from "@playwright/test";

const PUBLIC_PAGES = [
  { path: "/features", title: "Features" },
  { path: "/pricing", title: "Pricing" },
];

test.describe("New marketing pages", () => {
  for (const { path } of PUBLIC_PAGES) {
    test(`${path} renders`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

test.describe("New auth-protected pages", () => {
  const PAGES = ["/notifications", "/profile", "/search", "/analytics", "/onboarding"];
  for (const path of PAGES) {
    test(`${path} redirects to login when unauthenticated`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL("/");
    });
  }
});
