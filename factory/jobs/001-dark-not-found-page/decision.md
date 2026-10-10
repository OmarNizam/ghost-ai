ESCALATE

## Reason
Reason: AC8 signed-in check is unverified. A human with a Clerk session needs to open /does-not-exist, confirm a 404 in the Network tab and that "Back to editor" goes to /editor. All other ACs are proven and round 1 is 4/4 PASS.

## Evidence
- AC1 (server component, default export, no props or hooks): `app/not-found.tsx` in the diff has no `"use client"` and is `export default function NotFound()`. build.md AC1 grep; review-code.md.
- AC2 (heading plus muted line): `<h1>` "Page not found", a `404` label, and one `text-copy-muted` line. Seen in the diff; build.md; review-ux.md.
- AC3 (one `next/link` to /editor styled with `buttonVariants` and `cn`, no `asChild`): diff line 25; build.md; review-code.md and review-ui.md.
- AC4 (token classes only): `bg-page`, `text-copy-primary`, `text-copy-muted`, `text-brand`, `bg-brand-dim` and `border-surface-border-subtle`. The palette and hex grep finds nothing. build.md; review-ui.md and review-code.md confirm the tokens exist in globals.css.
- AC5 (fills the viewport, centered): `flex min-h-dvh flex-1 items-center justify-center`, with a `max-w-sm` content block. Seen in the diff; review-ui.md.
- AC6 (radius and icon sizes): the link and the tile are `rounded-xl`. There is no card. The `Ghost` icon is `h-4 w-4` with `aria-hidden`. The button has no icon, so the `h-5 w-5` rule does not apply. Diff; build.md; review-ui.md.
- AC7 (accessibility): one `<h1>` inside `<main>`, and the link text says where it goes. build.md checked the rendered HTML; review-ux.md.
- AC8 (auth unchanged): split result.
  - PROVEN: `proxy.ts` has no diff (checked by the approver with `git diff develop...HEAD --stat`). Signed out, `/does-not-exist` returns 307 to `/sign-in` (build.md, `npm run start` on port 3123).
  - UNVERIFIED: the signed-in browser check (404 status, link goes to /editor). build.md lists it under "Open" and review-code.md says "not verified". The only stand-in is `/missing.png`, which returned 404 with the new page under the root layout, and the spec says not to treat that route as a guaranteed AC.
- AC9 (no root loading.tsx): `app/` has no `loading.tsx`, and the `/missing.png` response was a 404, not a streamed 200. build.md; review-code.md.
- Lint/build: both pass, and `/_not-found` is prerendered as static. build.md; review-code.md re-ran both in the worktree.
- Docs: `context/feature-specs/04-dark-not-found-page.md` is added (04 is the next free number in the root `context/feature-specs`), plus one Completed line in `context/progress-tracker.md`. Seen in the diff.
- Scope: the diff is exactly the 3 in-scope files. The worktree is clean and the merge base is `develop` @ 94113e1. No new dependency, no schema, auth or proxy change.

## Risk
- Low. The page is a static server component. It reads no input and links only to the hard-coded internal path `/editor`, so it cannot be used as an open redirect.
- The one open question is runtime: whether a signed-in unknown path really returns 404 with this page. Reading `proxy.ts`, `auth.protect()` passes signed-in requests through, so the result should match the `/missing.png` check. It has still not been observed.
- Existing behavior, not caused by this job: the `proxy.ts` matcher skips paths with static file extensions, so signed-out users can see this page at URLs like `/missing.png`. The page shows no data.
- Follow-up outside this job's scope: existing `<Button>` usages (`project-sidebar.tsx`, `editor-navbar.tsx`) give their icons `h-5 w-5`, but the `size-4` rule in `buttonVariants` overrides that, so those icons render at 16px.
