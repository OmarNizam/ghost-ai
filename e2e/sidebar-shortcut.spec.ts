import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";

// Spec: context/feature-specs/05-sidebar-toggle-shortcut.md (AC10)
test.describe("sidebar toggle shortcut, signed in", () => {
  const email = process.env.E2E_CLERK_USER_EMAIL;
  test.skip(!email, "Set E2E_CLERK_USER_EMAIL in .env.local to an existing Clerk test user.");

  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await clerk.signIn({ page, emailAddress: email! });
  });

  test("Cmd/Ctrl + B opens and closes the project sidebar (AC10)", async ({ page }) => {
    await page.goto("/editor");
    // The toggle's name flips between "Open sidebar" and "Close sidebar", and the
    // sidebar's X is also "Close sidebar", so target the navbar toggle by aria-controls.
    const toggle = page.locator('[aria-controls="project-sidebar"]');
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ControlOrMeta+b");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("ControlOrMeta+b");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
