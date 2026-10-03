# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Phase 1: Design System

## Current Goal

- Implement `context/feature-specs/01-design-system.md` (shadcn/ui setup, UI primitives, `cn()` helper, dark theme).

## Completed

- 01 Design System — shadcn/ui initialized (style `base-nova`, built on `@base-ui/react`); added Button, Input, Card, Dialog, Tabs, Textarea, ScrollArea in `components/ui/`; installed `lucide-react`; `lib/utils.ts` exports `cn()`; `app/globals.css` holds the dark-only token palette from `ui-context.md`; `app/page.tsx` demos every component. `npm run build` and `npm run lint` pass.

## In Progress

- None.

## Next Up

- Next feature spec (not yet written).

## Open Questions

- `ui-context.md` lists `--border-default` twice (`#2a2a30` as "Default border" and `#1e1e23` as "Border"). `#2a2a30` is used for now; confirm which is intended.

## Architecture Decisions

- shadcn/ui uses the `base-nova` style (current CLI default) on `@base-ui/react`, not Radix. Composition uses the `render` prop (e.g. `<DialogTrigger render={<Button />}>`) instead of `asChild`.
- `cn()` comes from the `cn` package (shadcn's drop-in replacement for clsx + tailwind-merge), re-exported from `lib/utils.ts`. All code, including `components/ui/*`, imports it from `@/lib/utils` so there is a single entry point.
- Dark-only: `dark` class is set on `<html>` (so shadcn `dark:` variants apply) and `color-scheme: dark` on `:root`. There is no light palette.
- shadcn semantic variables (`--background`, `--primary`, `--card`, …) are mapped onto Ghost AI tokens in `:root`, so generated components get the Ghost AI palette without edits. Primary = brand cyan, accent = `--accent-primary`, destructive = `--state-error`, ring = brand.
- Ghost AI Tailwind tokens (`@theme inline`): `bg-page`, `bg-surface`, `bg-elevated`, `bg-subtle`, `border-surface-border`, `border-surface-border-subtle`, `text-copy-{primary,secondary,muted,faint,ai}`, `brand`, `brand-dim`, `ai`, `state-{error,success,warning}`. The page background token is `page`, not `base`, because `--color-base` overrides Tailwind's `text-base` font-size utility with a color.
- Radius scale is applied at call sites (`rounded-2xl` on cards, `rounded-3xl` on dialogs) rather than in `components/ui/*`.

## Session Notes

- `npx shadcn@latest add <component>` generates `import { cn } from "cn"`. After adding a component, rewrite that import to `from "@/lib/utils"` (one-line change; it's the only edit made to generated files).
- Keep `shadcn` in `dependencies`: `globals.css` imports `shadcn/tailwind.css`.
