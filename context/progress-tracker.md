# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Phase 3: Authentication

## Current Goal

- Implement `context/feature-specs/03-auth.md`: Clerk sign-up / sign-in / sign-out, route protection via `proxy.ts`, dark-themed auth pages, and auth state in the editor navbar.

## Completed

- Software factory — `/factory` skill (`.claude/skills/factory/SKILL.md`) makes the running session the orchestrator: spec-writer → builder → four parallel reviewers (security, ux, ui, code) → wait for all four review files → back to the builder on any CHANGES (max 2 review rounds, then needs-human) → approver → merge into `main` or needs-human. Agents live in `.claude/agents/`; state lives in `factory/board.json` (orchestrator is the only writer), job files in `factory/jobs/<job-id>/`, queue in `factory/backlog.md`. Each job builds in its own worktree (`.claude/worktrees/factory-<job-id>`, branch `factory/<job-id>` cut from `main`) with `npm ci` and a symlinked `.env.local` (a symlinked `node_modules` breaks Turbopack). The builder commits each job's spec as `context/feature-specs/NN-<slug>.md` plus a Completed line here on the feature branch, so docs merge with the code. Dashboard: `cd factory && python3 -m http.server`, open `dashboard.html` (`?demo` shows sample jobs).

- Scope: `docs/scope/scope.md` plans the rest of the product (Tracer Bullet, Beta workflow). Features 1 to 5 are enrolled as existing; next come the data model and error monitoring foundations, then Slice 1 (projects, canvas, AI generation, spec generation) and later slices for realtime, sharing, templates, history, and launch readiness.
- Context audit: root `AGENTS.md` gained Stack, Build approach (placeholder until `/scope`), Commands with the required Clerk env vars, three global Rules (`proxy.ts`, Base UI `render` prop, `cn` import path) and the Clerk Agent skills. Context docs now match the code: `ui-context.md` names the real token classes instead of `bg-[var(...)]`, `architecture.md` and `code-standards.md` describe `context/` as docs and `app/` as the router (no `pages/` or `styles/`), `text-brand` typo fixed, and `project-overview.md` stores canvas snapshots in Vercel Blob.

- README — replaced the create-next-app boilerplate with a project README: overview, quick start with the required Clerk env vars, scripts, a built-vs-planned status table, project structure, Next 16 / Base UI / token gotchas, the `context/` reading order, and the branch → `develop` → `main` contribution flow.
- Metadata — `app/layout.tsx` title is now "Ghost AI" and the description reuses the auth panel tagline, replacing the create-next-app defaults.
- 03 Auth — Clerk (`@clerk/nextjs` v7 + `@clerk/ui`). `ClerkProvider` sits inside `<body>` in `app/layout.tsx` with `lib/clerk-appearance.ts` (Clerk `dark` theme, variables mapped to the `globals.css` tokens via `var(--…)`, no hardcoded colors). `proxy.ts` protects every route except the paths in `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (and their sub-paths); matcher includes `/__clerk/:path*`. `/` redirects to `/editor` when signed in, otherwise to sign-in. Auth pages live in the `app/(auth)` route group: a 50/50 split on `lg+` (left `bg-surface` panel with logo, headline, description, three icon + title + description feature rows and a copyright footer; right `bg-page` with the centered Clerk form), form-only on small screens. The left panel follows a reference design supplied by the user and replaces the spec's text-only feature list. Clerk renders Geist at a 1rem base with full-width "Continue with …" social buttons stacked one per row. `UserButton` sits in the editor navbar's right section. `tsc`, `npm run lint` and `npm run build` pass; unauthenticated `/` and `/editor` return 307 to `/sign-in`, auth pages return 200.

- 02 Editor — `components/editor/editor-navbar.tsx` (h-14 three-column bar, `PanelLeftOpen`/`PanelLeftClose` toggle, Ghost AI home link in the center, empty right section), `components/editor/project-sidebar.tsx` (absolute overlay that slides in from the left via `translate-x`, `inert` when closed, Projects header + close, My/Shared Projects tabs with empty states, full-width `New Project` button), `components/editor/dialog.tsx` (`EditorDialog`: fixed 520×420 frame with header/content/footer slots, slide + fade transition). Composed in `components/editor/editor-shell.tsx`, which `app/editor/layout.tsx` wraps around every `/editor` route's content; `New Project` opens a placeholder dialog. `tsc`, `npm run lint` and `npm run build` pass.
- 01 Design System — shadcn/ui initialized (style `base-nova`, built on `@base-ui/react`); added Button, Input, Card, Dialog, Tabs, Textarea, ScrollArea in `components/ui/`; installed `lucide-react`; `lib/utils.ts` exports `cn()`; `app/globals.css` holds the dark-only token palette from `ui-context.md`; `app/page.tsx` demos every component. `npm run build` and `npm run lint` pass.

## In Progress

- None.

## Next Up

- Manually verify the full sign-up → sign-in → sign-out flow in the browser with a real test account.
- Next feature spec (not yet written).

## Open Questions

- `ui-context.md` lists `--border-default` twice (`#2a2a30` as "Default border" and `#1e1e23` as "Border"). `#2a2a30` is used for now; confirm which is intended.

## Architecture Decisions

- shadcn/ui uses the `base-nova` style (current CLI default) on `@base-ui/react`, not Radix. Composition uses the `render` prop (e.g. `<DialogTrigger render={<Button />}>`) instead of `asChild`.
- `cn()` comes from the `cn` package (shadcn's drop-in replacement for clsx + tailwind-merge), re-exported from `lib/utils.ts`. All code, including `components/ui/*`, imports it from `@/lib/utils` so there is a single entry point.
- Dark-only: `dark` class is set on `<html>` (so shadcn `dark:` variants apply) and `color-scheme: dark` on `:root`. There is no light palette.
- shadcn semantic variables (`--background`, `--primary`, `--card`, …) are mapped onto Ghost AI tokens in `:root`, so generated components get the Ghost AI palette without edits. Primary = brand cyan, accent = `--accent-primary`, destructive = `--state-error`, ring = brand.
- Ghost AI Tailwind tokens (`@theme inline`): `bg-page`, `bg-surface`, `bg-elevated`, `bg-subtle`, `border-surface-border`, `border-surface-border-subtle`, `text-copy-{primary,secondary,muted,faint,ai}`, `brand`, `brand-dim`, `ai`, `state-{error,success,warning}`. The page background token is `page`, not `base`, because `--color-base` overrides Tailwind's `text-base` font-size utility with a color.
- The navbar and sidebar live in `app/editor/layout.tsx` (via the client `EditorShell`, which owns sidebar/dialog state and renders `children` inside `<main>`), so they persist across editor routes. The layout and pages stay server components. The sidebar is positioned inside a `relative` content area below the navbar, so it overlays the canvas without pushing it.
- `EditorDialog` wraps the shadcn/Base UI `Dialog` rather than reimplementing a modal, so focus trapping, Escape-to-close, scroll lock, and focus restoration come from Base UI. It is controlled via `isOpen` / `onClose`; actions are passed through the `footer` slot.
- Route protection is two-layered: `proxy.ts` (Next 16's renamed `middleware.ts`) protects everything except the auth paths, and protected layouts/pages also call `auth.protect()` / `auth()` (e.g. `app/editor/layout.tsx`). Clerk's `createRouteMatcher` is deprecated in v7, so public paths are matched with a plain pathname check built from the sign-in/sign-up env vars.
- Clerk appearance overrides stay minimal: theme variables, `options.socialButtonsVariant`, one `elements.socialButtons` grid override, and the `socialButtonsBlockButtonManyInView` string in `lib/clerk-localization.ts`. `colorBorder` uses `--text-primary` because Clerk draws borders at ~7–11% alpha of that colour; the dark `--border-default` token came out invisible.
- Clerk env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`. The sign-in/up route folders (`app/(auth)/sign-in/[[...sign-in]]`, `app/(auth)/sign-up/[[...sign-up]]`) must match these values. After sign-in Clerk returns to `/`, which redirects to `/editor`; no extra redirect env vars are used.
- The `app/page.tsx` design-system demo was replaced by the auth redirect.
- Radius scale is applied at call sites (`rounded-2xl` on cards, `rounded-3xl` on dialogs) rather than in `components/ui/*`.

## Session Notes

- `npx shadcn@latest add <component>` generates `import { cn } from "cn"`. After adding a component, rewrite that import to `from "@/lib/utils"` (one-line change; it's the only edit made to generated files).
- Keep `shadcn` in `dependencies`: `globals.css` imports `shadcn/tailwind.css`.
