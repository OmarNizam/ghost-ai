VERDICT: PASS

## Findings

- Lint and build pass in the worktree. `/_not-found` is prerendered. Tokens used all exist in `app/globals.css`.
- AC1-AC7, AC9 are met in the code. It is a server component with a default export, one `h1` inside `main`, only token classes, `buttonVariants` in the Link `className` through `cn` from `@/lib/utils`, `rounded-xl`, `aria-hidden` on the icon. No `loading.tsx`. `components/ui/*` and `proxy.ts` are untouched. Spec copy `04-dark-not-found-page.md` and the progress line are present.
- nit: `app/not-found.tsx:7` has `flex-1` and `min-h-dvh` together, which is redundant but harmless.
- nit: `app/not-found.tsx:25` is a long line; prettier-style wrapping would be tidier.
- not verified: AC8 runtime checks (the 307 redirect when signed out, the 404 status when signed in). I did not run the server.
