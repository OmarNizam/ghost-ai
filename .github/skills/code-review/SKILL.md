---
name: code-review
description: Ghost AI pull request review checklist. Use ONLY when reviewing a GitHub pull request in this repository (Copilot code review). Do not use for chat, code generation, or any task other than reviewing a pull request.
---

# Ghost AI pull request review

Use this skill only while reviewing a GitHub pull request. For any other task, ignore it.

## Gather context first

1. Read the PR description and any linked issue (use the GitHub MCP server).
2. If the PR implements a feature spec in `context/feature-specs/`, read that spec. Check the diff against each requirement and its "Check when done" list. Flag requirements that are missing or only partly done.
3. Use these as the source of truth: `context/architecture.md`, `context/code-standards.md`, `context/ui-context.md`.
4. This project runs a Next.js version with breaking changes. When an API looks unfamiliar, check `node_modules/next/dist/docs/` before flagging it. Don't assume older Next.js conventions.

## What to check

### Correctness and architecture
- Auth and ownership are enforced at every mutation boundary. Route handlers in `app/api/` validate input before running any logic.
- Large generated artifacts (canvas snapshots, Markdown specs) go to Vercel Blob. Prisma stores only the reference path.
- Long-running AI work runs in `trigger/` (Trigger.dev), not in route handlers.
- Liveblocks room tokens are issued only after the code verifies auth and project membership.

### Next.js and React
- Components are server components by default. Flag `"use client"` on a component that doesn't need browser interactivity or client state.
- Layouts and pages stay server components. Client state lives in a dedicated client component, as in `components/editor/editor-shell.tsx`.

### TypeScript
- Strict typing: no `any`. Use `interface` for object contracts.
- Unknown external input is validated at system boundaries.

### Styling and UI
- Use only design tokens from `app/globals.css`: `bg-page`, `bg-surface`, `bg-elevated`, `text-copy-*`, `border-surface-border`, `text-brand`, and so on. Flag hardcoded hex values and raw Tailwind palette classes such as `zinc-*` or `gray-*`.
- Radius scale: `rounded-xl` for small UI, `rounded-2xl` for cards and panels, `rounded-3xl` for modals.
- Icons come from `lucide-react`: `h-4 w-4` inline, `h-5 w-5` in buttons. Decorative icons have `aria-hidden`.
- shadcn components are built on Base UI, not Radix. Composition uses the `render` prop, not `asChild`.
- `cn` is imported from `@/lib/utils`, never directly from `"cn"`.
- Layouts stay usable on narrow and short viewports and at high zoom. Fixed sizes need `max-w-*` or `max-h-*` caps.
- Accessibility: interactive elements have accessible names. Hidden off-canvas panels are `inert`. Modals trap focus. Use the shared `components/editor/dialog.tsx` rather than writing a new modal.

### Project hygiene
- If the PR changes features, architecture, or project structure, `context/progress-tracker.md` is updated to match.
- Files are named after what they do, not the technology. Modules stay small and single-purpose.

## How to report

- Prioritize correctness, security, and accessibility bugs over style.
- For each finding, give a concrete failure scenario and a suggested fix.
- Don't flag code that already follows this project's documented conventions, even if it differs from general best practice.
