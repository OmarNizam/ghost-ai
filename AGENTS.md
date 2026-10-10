<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Application Building Context

This section provides context for building applications using this version of Next.js. It includes guidelines, best practices, and considerations to keep in mind while developing your application.
Read the following guidelines files in order before implementing or making ant architecural decisions:

1. `context/project-overview.md` - Provides an overview of the project, including its goals, structure, and key components.
2. `context/architecture.md` - Details the architectural decisions, patterns, and guidelines for building the application.
3. `context/ui-context.md` - Provides context and guidelines for the user interface aspects of the application.
4. `context/code-standards.md` - Provides guidelines and best practices for writing consistent and maintainable code within the project.
5. `context/ai-workflow-rules.md` - Provides rules and guidelines for integrating AI workflows within the project.
6. `context/progress-tracker.md` - Provides a mechanism to track the progress of the project, including completed tasks, ongoing work, and upcoming features.

Update `context/progress-tracker.md` after each meaningful implementation, change, or milestone in the project.

If implementation changes the architecture, project structure, or any significant aspect of the application, ensure that `context/progress-tracker.md` is updated accordingly to reflect these changes before continue.

## Stack

Installed (from `package.json`): Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui (`base-nova` style on `@base-ui/react`), Clerk v7 (`@clerk/nextjs` + `@clerk/ui`), Lucide icons.
Planned, not installed yet: Prisma + PostgreSQL, Liveblocks + React Flow, Trigger.dev, Vercel Blob (see `context/architecture.md`).

## Build approach

Tracer Bullet (prove one real thread through every layer, then thicken one segment at a time). Set in `docs/scope/scope.md`.

## Commands

```bash
npm install
npm run dev     # needs .env.local with the Clerk vars below
npm run build   # must pass before a unit is done
npm run lint
npm test          # Vitest + Testing Library (jsdom); unit tests sit beside the source as *.test.tsx
npm run test:e2e  # Playwright in e2e/; builds and serves on port 3100
```

Required in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`. `proxy.ts` throws on startup if either URL var is missing.

E2E needs `npx playwright install chromium` once. Signed in e2e tests are skipped unless `E2E_CLERK_USER_EMAIL` (in `.env.local`) names an existing Clerk user; the dev instance has `e2e+clerk_test@example.com`.

## Rules

- Route protection lives in `proxy.ts` (Next 16 renamed `middleware.ts`). Only the sign in and sign up paths are public; protected layouts also call `auth.protect()`.
- shadcn components here are Base UI, not Radix: compose with the `render` prop (`<DialogTrigger render={<Button />}>`), never `asChild`.
- Import `cn` only from `@/lib/utils`. After `npx shadcn@latest add`, rewrite the generated `from "cn"` import to `@/lib/utils`.

## Agent skills

- [clerk](.agents/skills/clerk/): `clerk/skills`, routes a Clerk task to the right skill
- [clerk-nextjs-patterns](.agents/skills/clerk-nextjs-patterns/): `clerk/skills`, proxy, Server Actions, caching with Clerk
- [clerk-custom-ui](.agents/skills/clerk-custom-ui/): `clerk/skills`, appearance and custom auth flows
- [clerk-setup](.agents/skills/clerk-setup/), [clerk-cli](.agents/skills/clerk-cli/), [clerk-backend-api](.agents/skills/clerk-backend-api/): `clerk/skills`, setup, CLI, Backend API
- [clerk-testing](.agents/skills/clerk-testing/): `clerk/skills`, Playwright sign in helpers and testing tokens for the e2e suite
- [playwright-best-practices](.agents/skills/playwright-best-practices/): `currents-dev/playwright-best-practices-skill`, writing and debugging Playwright e2e tests
- [vitest](.agents/skills/vitest/): `antfu/skills`, Vitest config, mocking, and test patterns
- MCP servers: Playwright MCP `@playwright/mcp` (recommended)
