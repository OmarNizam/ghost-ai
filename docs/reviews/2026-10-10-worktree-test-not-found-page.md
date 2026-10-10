# Review, worktree-test-not-found-page, 2026-10-10

**Reviewed by**: Sonnet 5.5 (author on Sonnet 5.5)
**Scope**: 11 files (plus package-lock.json), branch vs origin/develop (merge base 084cef3)
**Verdict**: Approve with nits

## Summary
Adds the project's first test runner: Vitest 4 with Testing Library on jsdom for unit tests, and Playwright with @clerk/testing for e2e. It also adds first suites for the unchanged `app/not-found.tsx`, and makes the factory `code-reviewer` run `npm test`. The wiring is sound (`npm test` 8 passed, `tsc --noEmit` clean, lint and build reported passing), the config is careful about worktrees and the Babel clash, and the tests trace to AC1 to AC9. Remaining issues are coverage and documentation gaps, none blocking.

## Minor
### 🟡 Signed in e2e (AC8 positive path, AC9) is skipped by default and never gated, `e2e/not-found.spec.ts:26`
**Problem**: The 404 status, dark page and "Back to editor" navigation tests only run when `E2E_CLERK_USER_EMAIL` is set. The factory code-reviewer runs only `npm test`, so these are not exercised in the factory.
**Why it matters**: The key contract (404 status, no streaming) can regress with no failing check. Skips are also quiet in the `line` reporter.
**Suggested fix**: Accept it for now, but note in the progress tracker or test docs that the factory does not run e2e. Later consider a CI job that sets the variable.

### 🟡 Unit tests do not cover the static parts of the spec, `app/not-found.test.tsx:9`
**Problem**: AC1 (no `"use client"`), AC4 (tokens only, no hex or raw palette classes), AC5 (`min-h-dvh`/`flex-1`, max width) and the AC6 radius (`rounded-xl`) are not asserted. The AC1 test checks `NotFound.length` and a non Promise return, which does not prove a server component.
**Why it matters**: A later edit could add a hex color or a client directive and the suite would still pass.
**Suggested fix**: Add a small test that reads the `app/not-found.tsx` source and asserts no `"use client"`, no hex colors, no raw palette classes, and that `bg-page`, `text-copy-primary` and `text-copy-muted` are present.

### 🟡 Playwright prerequisites are undocumented, `playwright.config.ts:24`
**Problem**: Nothing says to run `npx playwright install chromium` before `npm run test:e2e`, and `reuseExistingServer: !process.env.CI` can silently reuse a stale server already on port 3100.
**Why it matters**: A fresh clone fails with a browser missing error, and a leftover server can make results reflect old code.
**Suggested fix**: Document the one time browser install and the port 3100 behavior in the progress tracker entry or a short testing note. Consider turning off server reuse.

## Nits
- ⚪ `AGENTS.md`, still says "No test runner is set up yet" and lacks `npm test`; /sync owns it, so make sure it runs right after merge.
- ⚪ `e2e/not-found.spec.ts:19`, the negative heading check right after `waitForURL` is weak because it passes before the page settles.
- ⚪ `app/not-found.test.tsx:10`, asserting `NotFound.length` tests an implementation detail rather than behavior.
- ⚪ `vitest.config.mts:6`, the `@` alias duplicates tsconfig `paths` by hand; fine now, will drift only if paths change.

## Strengths
- Deliberate, documented config choices: no `@vitejs/plugin-react` (Babel 8 clash), `.claude/**` excluded so sibling worktrees do not run twice, e2e excluded from Vitest, port 3100 to avoid clashing with `npm run dev`, production build so status codes match users.
- Tests assert behavior through roles and accessible names (single link, `/editor` href, one h1 in main, Tab focus, aria-hidden icon) and each cites its AC.
- The code-reviewer change degrades gracefully when a branch has no `test` script (a nit, not a failure) and asks for counts.
- Signed out e2e runs without Clerk Backend API calls; `clerkSetup` only runs when a test user is configured.

## Test coverage
Unit: 8 tests cover AC1 (partially), AC2, AC3, AC6 (aria-hidden only), AC7. Not covered by unit tests: AC4, AC5, and the AC6 radius and icon sizes. E2E: AC8 signed out redirect (two tests, run by default), AC8 and AC9 signed in (two tests, skipped without `E2E_CLERK_USER_EMAIL`). AC9 is covered only indirectly through the 404 status check.
