import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";

// Spec: context/feature-specs/04-dark-not-found-page.md (AC8, AC9)
const UNKNOWN_PATH = "/does-not-exist";

test.describe("unknown URL, signed out", () => {
  test("redirects to sign in instead of showing the 404 page (AC8)", async ({ request }) => {
    const response = await request.get(UNKNOWN_PATH, { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(new URL(response.headers().location, "http://x").pathname).toBe("/sign-in");
  });

  test("lands the visitor on the sign in page (AC8)", async ({ page }) => {
    await page.goto(UNKNOWN_PATH);

    await page.waitForURL((url) => url.pathname.startsWith("/sign-in"));
    await expect(page.getByRole("heading", { name: "Page not found" })).toHaveCount(0);
  });
});

test.describe("unknown URL, signed in", () => {
  const email = process.env.E2E_CLERK_USER_EMAIL;
  test.skip(!email, "Set E2E_CLERK_USER_EMAIL in .env.local to an existing Clerk test user.");

  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await clerk.signIn({ page, emailAddress: email! });
  });

  test("shows the dark 404 page with a 404 status (AC8, AC9)", async ({ page }) => {
    const response = await page.goto(UNKNOWN_PATH);

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  });

  test("takes the user to the editor from 'Back to editor' (AC8)", async ({ page }) => {
    await page.goto(UNKNOWN_PATH);

    await page.getByRole("link", { name: "Back to editor" }).click();

    await page.waitForURL((url) => url.pathname === "/editor");
  });
});
