# Ghost AI

A real-time collaborative system design workspace. You describe a system in plain English, an AI agent lays it out as an architecture diagram on a shared canvas, your collaborators refine it with you, and Ghost AI turns the result into a Markdown technical specification.

> **Status: early development.** The design system, the editor shell, and Clerk authentication work today. The collaborative canvas, AI generation, templates, and spec output are planned and not built yet. See [What works today](#what-works-today).

## Quick start

You need Node.js 20+ and a [Clerk](https://clerk.com) application (the free tier is enough).

```bash
git clone https://github.com/OmarNizam/ghost-ai.git
cd ghost-ai
npm install
```

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Copy the two keys from the Clerk dashboard (**API Keys**). Leave the sign-in and sign-up URLs exactly as shown, because they have to match the route folders under `app/(auth)/`.

```bash
npm run dev
```

Open http://localhost:3000. You'll be redirected to `/sign-in`. Once you've signed in, `/` takes you to `/editor`.

## Scripts

| Command            | What it does                                                 |
| ------------------ | ------------------------------------------------------------ |
| `npm run dev`      | Start the dev server on `:3000`                              |
| `npm run build`    | Production build                                             |
| `npm run start`    | Serve the production build                                   |
| `npm run lint`     | Run ESLint                                                   |
| `npm test`         | Run the Vitest unit tests                                    |
| `npm run test:e2e` | Run the Playwright browser tests (builds and serves `:3100`) |

Before opening a PR, run `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build`.

Browser tests need `npx playwright install chromium` once. The signed in browser tests are skipped unless `E2E_CLERK_USER_EMAIL` in `.env.local` names an existing Clerk user.

## What works today

| Area          | State   | Notes                                                                                   |
| ------------- | ------- | --------------------------------------------------------------------------------------- |
| Design system | Done    | shadcn/ui (`base-nova` style on `@base-ui/react`), dark-only token palette              |
| Editor shell  | Done    | Navbar, slide-in project sidebar, dialog frame. The project list is a placeholder for now |
| Auth          | Done    | Clerk sign-in/up/out, every route except the auth pages is protected                    |
| Projects + DB | Planned | Prisma + PostgreSQL                                                                     |
| Canvas        | Planned | Liveblocks + React Flow, live cursors and presence                                      |
| AI generation | Planned | Trigger.dev background jobs for architecture and spec generation                        |
| Artifacts     | Planned | Vercel Blob for canvas snapshots and generated specs                                    |

[`context/progress-tracker.md`](context/progress-tracker.md) is the live record of what's done and what's next.

## Project structure

```
app/
  (auth)/            Sign-in and sign-up pages (Clerk), split-panel layout
  editor/            Editor routes; layout wraps them in the editor shell
  layout.tsx         Root layout, ClerkProvider
  page.tsx           Redirects to /editor or /sign-in
  globals.css        Design tokens (CSS custom properties + Tailwind theme)
components/
  ui/                shadcn/ui primitives
  editor/            Navbar, project sidebar, dialog, shell
lib/
  utils.ts           cn() helper (single import point for class merging)
  clerk-*.ts         Clerk theme and copy overrides
proxy.ts             Route protection (Next.js 16's replacement for middleware.ts)
context/             Project docs that humans and AI agents read before changing code
```

## Things that will trip you up

- **This is Next.js 16.** APIs and conventions differ from older versions. For example, `middleware.ts` is now `proxy.ts`. Before relying on something you remember, check the docs bundled at `node_modules/next/dist/docs/`.
- **shadcn/ui is built on Base UI here, not Radix.** Compose with the `render` prop (`<DialogTrigger render={<Button />}>`), not `asChild`.
- **Fix the import after adding a shadcn component.** `npx shadcn@latest add <name>` generates `import { cn } from "cn"`. Change it to `from "@/lib/utils"`.
- **Use design tokens, never raw colors.** Use classes such as `bg-page`, `bg-surface`, `text-copy-primary`, `border-surface-border` and `text-brand`. No `zinc-*` classes or hex values. The full list is in [`context/progress-tracker.md`](context/progress-tracker.md#architecture-decisions).
- **The app is dark-only.** There is no light palette.

## Documentation

Ghost AI is built with AI coding agents, and the `context/` folder is the source of truth for them and for people. Read these files in this order before making architectural changes:

1. [`project-overview.md`](context/project-overview.md): goals, user flow, scope
2. [`architecture.md`](context/architecture.md): stack, system boundaries, storage and access model
3. [`ui-context.md`](context/ui-context.md): visual language and tokens
4. [`code-standards.md`](context/code-standards.md): TypeScript, Next.js, styling, API rules
5. [`ai-workflow-rules.md`](context/ai-workflow-rules.md): how agents should work in this repo
6. [`progress-tracker.md`](context/progress-tracker.md): current phase, decisions, open questions

Each feature has a spec in [`context/feature-specs/`](context/feature-specs/). Code review notes are kept in [`docs/reviews/`](docs/reviews/). Agent instructions live in [`AGENTS.md`](AGENTS.md), and `CLAUDE.md` points to that file.

## Contributing

1. Branch off `develop` (`feature/<name>`, `fix/<name>`, `chore/<name>`).
2. If you're starting a new feature, write or update its spec in `context/feature-specs/` first.
3. Keep to [`context/code-standards.md`](context/code-standards.md): server components by default, auth and ownership checks at every mutation, tokens for every color.
4. Update [`context/progress-tracker.md`](context/progress-tracker.md) in the same PR.
5. Open the PR against `develop`. `develop` is merged into `main` once it's stable.
