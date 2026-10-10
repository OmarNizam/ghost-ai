import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

// Load .env.local the way Next does, so the Clerk keys and E2E_CLERK_USER_EMAIL reach the tests.
loadEnvConfig(process.cwd());

// Not 3000, so a running `npm run dev` does not clash with the test server.
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Production build, so status codes match what users get (a streamed dev response can differ).
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: baseURL + "/sign-in",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
