# Build: 001-dark-not-found-page

Branch `factory/001-dark-not-found-page`, commit `2fb67b6` (on top of `develop` @ `94113e1`).

## What changed

- `app/not-found.tsx` (new): server component. `<main>` wrapper (`flex min-h-dvh flex-1 items-center justify-center bg-page p-4`), a `max-w-sm` centered block with a Ghost brand tile (`bg-brand-dim`, `text-brand`, `rounded-xl`), a `404` label, `<h1>` "Page not found", one muted line, and one `next/link` to `/editor` styled with `cn(buttonVariants({ size: "lg" }), "rounded-xl px-4")`.
- `context/feature-specs/04-dark-not-found-page.md` (new): copy of `spec.md`. 04 is next after `03-auth.md` in both the root and the worktree.
- `context/progress-tracker.md`: one new line under `## Completed`.

Nothing else changed. `proxy.ts`, `app/layout.tsx`, `app/globals.css`, `next.config.*`, `components/ui/*` have no diff.

## AC to evidence

- **AC1**: `app/not-found.tsx` has no `"use client"`. It is `export default function NotFound()` with no props and no hooks. A grep for `use client|asChild|useState|useEffect|useRouter|usePathname` finds nothing.
- **AC2**: `<h1>` "Page not found", a `404` label (`font-mono text-sm text-brand`) and one `text-sm text-copy-muted` line: "This page does not exist or has moved."
- **AC3**: there is one `<Link href="/editor">` with the text "Back to editor". It is styled with `buttonVariants` from `@/components/ui/button` plus `cn` from `@/lib/utils`. There is no `<Button render>`, so no Base UI warning can come from it, and no `asChild`. In the rendered HTML, tailwind-merge resolved `rounded-lg` to `rounded-xl` and `px-2.5` to `px-4`.
- **AC4**: the wrapper has `bg-page`, the heading `text-copy-primary`, the body `text-copy-muted`, and the icon `text-brand` on `bg-brand-dim`. The tile border is `border-surface-border-subtle`. A grep for `#hex|zinc-|gray-|neutral-|slate-|stone-|black|white|bg-[var(|text-[var(` finds nothing.
- **AC5**: the wrapper uses `min-h-dvh flex-1 flex items-center justify-center`, and the content block is `w-full max-w-sm`.
- **AC6**: the link and the icon tile use `rounded-xl`. There is no card. The one Lucide icon (`Ghost`) is `h-4 w-4` with `aria-hidden`. The button has no icon on purpose. `buttonVariants` contains `[&_svg:not([class*='size-'])]:size-4`, which would shrink an `h-5 w-5` icon to 16px, so leaving the icon out avoids that.
- **AC7**: the rendered HTML for `/missing.png` has exactly one `<h1>`, and it sits inside `<main>`. The link text "Back to editor" says where it goes.
- **AC8**: `git diff develop -- proxy.ts` is empty. I ran `npm run start` on port 3123:
  - `curl -sI /does-not-exist` returned `HTTP/1.1 307` with `location: /sign-in?redirect_url=...%2Fdoes-not-exist`.
  - Signed-in browser check: **not done**, because I have no session. As a stand-in I used the spec's cookie-free route: `/missing.png` skips the proxy matcher and returned **404** with the new page ("Page not found", "Back to editor", `href="/editor"`) inside the root layout. `<html>` carries `dark` and the Geist font variables. A reviewer should still confirm the signed-in `/does-not-exist` check (404 in the DevTools Network tab, link goes to `/editor`).
- **AC9**: there is no `app/loading.tsx`. The 404 status above confirms the response is not streamed.
- **Lint/build**: `npm run lint` passes with no output. `npm run build` compiles, passes TypeScript, and prerenders `/_not-found` as static.
- **Docs**: `context/feature-specs/04-dark-not-found-page.md` and the Completed line in `context/progress-tracker.md`.

## Open

- The signed-in browser check in AC8 still needs a human or reviewer with a Clerk session.
- Existing code (`project-sidebar.tsx`, `editor-navbar.tsx`) puts `h-5 w-5` icons inside `<Button>`. `buttonVariants`' `size-4` rule overrides that, so those icons actually render at 16px. This job doesn't touch it, but it is worth a follow-up.
