# Dark not-found page

## Goal

Add a root `app/not-found.tsx` so that unmatched URLs and future `notFound()` calls show a Ghost AI page in the dark theme instead of the default Next.js 404 UI. The page tells the user the page does not exist and links back to `/editor`.

## Scope

- `app/not-found.tsx` (new): server component, default export, no props.
- `context/feature-specs/NN-dark-not-found-page.md` (copy of this spec) and one Completed line in `context/progress-tracker.md`.

Nothing else changes. `proxy.ts`, `app/layout.tsx`, `app/globals.css`, `next.config.*` and `components/ui/*` stay as they are.

## Out of scope

- `app/global-not-found.tsx` and the `experimental.globalNotFound` flag. That convention is experimental, needs a config flag, and skips the root layout, so `ClerkProvider`, the Geist fonts and the `dark` class on `<html>` would be lost. The app has a single root layout, so plain `not-found.tsx` is enough.
- Making unmatched paths public in `proxy.ts`. Per `AGENTS.md` and `architecture.md`, only the sign-in and sign-up paths are public. A signed-out user who hits an unknown path is still redirected to `/sign-in`.
- Adding `notFound()` calls to any existing route.
- Segment-level not-found pages (e.g. `app/editor/not-found.tsx`), `error.tsx`, `loading.tsx`.
- Page metadata or title changes for the 404 page.
- Adding new shadcn components or editing `components/ui/*`.
- Showing the editor navbar or sidebar on the 404 page. The page renders under the root layout only.

## Acceptance criteria

- [ ] AC1: `app/not-found.tsx` exists. It is a server component: no `"use client"` directive, a default-exported function component that takes no props, and no client hooks.
- [ ] AC2: The page renders a heading (e.g. "Page not found", with an optional "404" label) and one short line of muted body copy saying the page does not exist or has moved.
- [ ] AC3: The page has exactly one primary action. It is a `next/link` `Link` with `href="/editor"` and visible text such as "Back to editor". The preferred way to style it is to put `buttonVariants(...)` (exported from `@/components/ui/button`) in the Link's `className`, combined with `cn` from `@/lib/utils` if needed. If the builder uses `<Button render={<Link href="/editor" />}>` instead, it must not log a Base UI warning in the console. `asChild` is never used.
- [ ] AC4: Only theme tokens are used. The outer wrapper sets `bg-page` explicitly. The heading uses `text-copy-primary` and the body copy uses `text-copy-muted`. An optional accent icon uses `text-brand` and/or `bg-brand-dim`. Grepping `app/not-found.tsx` finds no `#` hex colors, no raw palette classes (`zinc-`, `gray-`, `neutral-`, `slate-`, `stone-`, `black`, `white`), and no `bg-[var(` / `text-[var(` arbitrary values.
- [ ] AC5: The layout fills the viewport and centers its content. The wrapper uses `flex-1` and/or `min-h-dvh` (the root `<body>` is `min-h-full flex flex-col`, as in `app/(auth)/layout.tsx`) with flex centering. The content block has a sensible max width.
- [ ] AC6: The radius scale and icon sizes follow `ui-context.md`. The link uses `rounded-xl`. A card or panel, if the builder adds one, uses `rounded-2xl`. Lucide icons are `h-4 w-4` inline and `h-5 w-5` inside the button. Decorative icons have `aria-hidden`.
- [ ] AC7: The page is accessible. It has exactly one `<h1>`, inside a `<main>` landmark. Link text describes where it goes.
- [ ] AC8: Auth behavior is unchanged and `proxy.ts` has no diff. With `npm run build && npm run start` (or `npm run dev`):
  - Signed out: `curl -sI http://localhost:3000/does-not-exist` returns `307` with `location` pointing at `/sign-in`.
  - Signed in (browser): visiting `/does-not-exist` shows the new dark page with HTTP status `404` (check the DevTools Network tab). Clicking the link goes to `/editor`.
- [ ] AC9: No `loading.tsx` is added at the root. Without one, the root not-found response is not streamed, so it returns `404` and not `200`.
- [ ] `npm run lint` and `npm run build` pass
- [ ] Spec copied to `context/feature-specs/NN-dark-not-found-page.md` (NN is the next free two-digit number; currently `04`, the builder confirms) and a line added to `context/progress-tracker.md`

## Notes

- Next.js 16 convention (from `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`): the root `app/not-found.tsx` handles every unmatched URL in the app as well as `notFound()` calls. It renders inside the root layout, so the `dark` class, the Geist fonts and `ClerkProvider` from `app/layout.tsx` apply automatically. It is a server component by default and takes no props. Responses are `404` unless streamed, which is why no `loading.tsx` is added.
- Reviewer check that needs no cookie (optional): the `proxy.ts` matcher skips paths with static file extensions, so a URL like `/missing.png` may reach the not-found page without a session. Do not treat this as a guaranteed AC. If it shows the new page, that is a quick way to see the UI while signed out.
- The UI is dark only (`ui-context.md`). Use the Tailwind token class names (`bg-page`, `bg-surface`, `bg-elevated`, `border-surface-border`, `text-copy-primary`, `text-copy-secondary`, `text-copy-muted`, `text-copy-faint`, `text-brand`, `bg-brand-dim`) and never hex values, raw palette classes or `bg-[var(...)]`. Note that the page background class is `bg-page`, not `bg-base`.
- For a consistent look, borrow the brand mark from `app/(auth)/layout.tsx` (the Lucide `Ghost` icon on `bg-brand`, or `text-brand` on `bg-brand-dim`). Keep the page compact: no gradients, no oversized hero.
- Server components are the default (`code-standards.md`). This page needs no interactivity, so no `"use client"`.
- shadcn here is Base UI, not Radix (`AGENTS.md`): compose with the `render` prop, never `asChild`. Import `cn` only from `@/lib/utils`.
- Lucide icons are stroke-based. Use `h-4 w-4` inline and `h-5 w-5` in buttons.
- Use `interface` for any object types, per `code-standards.md`. None are expected here.
