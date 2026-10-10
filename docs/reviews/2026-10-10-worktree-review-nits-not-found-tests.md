# Review, worktree-review-nits-not-found-tests, 2026-10-10

**Reviewed by**: Sonnet 5.5 (author on Sonnet 5.5)
**Scope**: 2 files, branch vs origin/develop (PR #18)
**Verdict**: Approve with nits

## Summary
Test-only follow-up to the earlier review nits on the dark 404 page. The e2e test now waits for Clerk's sign-in heading before asserting "Page not found" is absent, and the unit test drops the `NotFound.length` arity check in favor of a not-a-Promise check plus a no-props render. Both edits address the stated nits and are small and correct. Remaining points are minor.

## Minor
### 🟡 AC1 test still does not prove a server component, `app/not-found.test.tsx:9`
**Problem**: The test name claims "synchronous component that renders without props (AC1)", but AC1 also requires no `"use client"` directive and no client hooks. Neither the old nor the new assertions check that. `expect(() => render(<NotFound />)).not.toThrow()` is redundant, since every other test in the file already renders `<NotFound />` with no props and would fail on a throw.
**Why it matters**: The test title overstates coverage. A `"use client"` added later would pass unnoticed.
**Suggested fix**: Either narrow the test name to what it asserts, or read the `app/not-found.tsx` source and assert there is no `"use client"` line. Drop the redundant `not.toThrow` render.

## Nits
- ⚪ `e2e/not-found.spec.ts:20`, `/sign in/i` is coupled to Clerk's default copy and the application name; a localization or appearance change breaks it, and a second matching heading would trip strict mode. Acceptable now (4/4 pass). The inline comment is accurate.
- ⚪ `e2e/not-found.spec.ts:21`, the negative check is only as strong as the settled-page wait; a stronger form is to also assert the URL still starts with `/sign-in` after the wait, or to assert the positive sign-in state alone. Optional.

## Strengths
- Both changes are minimal and directly match the review nits; the removed assertion was an implementation detail, and the added wait uses a web-first assertion, not a fixed timeout.
- The explanatory comment says why the wait exists, not what it does.

## Test coverage
Test-only change. Unit: 8 tests pass; AC1 now asserted behaviorally but still not for the server-component directive (see Minor). E2E: signed-out AC8 tests run by default (4/4 pass); signed-in tests remain skipped without `E2E_CLERK_USER_EMAIL`, unchanged by this PR.
