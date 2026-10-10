import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    // e2e/ belongs to Playwright; .claude/ holds other worktrees with their own copies of the tests.
    exclude: ["node_modules/**", ".next/**", "e2e/**", ".claude/**"],
  },
});
