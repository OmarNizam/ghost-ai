# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes, do not layer workarounds
- Do not mix unrelated concerns in one
  component or route
- Respect the system boundaries defined in `architecture.md`

## TypeScript

- Strict mode is required throughout the project
- Avoid any — use explicit interfaces or narrowly
  scoped types
- Validate unknown external input at system
  boundaries before trusting it
- Use interface for object contracts instead of type aliases where possible.

## Next.js

- Default to server components.
- Add use client only when browser interactivity requires it.
- Keep route handlers focused on a single responsibility.
- long-running tasks should be handled in background processes rather than in route handlers.

## Styling

- Use CSS custom property tokens defined in globals.css — no raw Tailwind color classes like zinc-\*
  or hardcoded hex values.
- Reference tokens through their Tailwind class names: `bg-page`, `text-copy-primary`, `border-surface-border`,
  `tex-brand`, etc.
- Maintain the border radius scale: `rounded-xl` for small elements, `rounded-2xl` for cards and
  `rounded-3xl` for modals.
- Follow the border radius scale defined in `ui-context.md`.

## API Routes

- Validate and parse request input before any logic runs
- Enforce auth and ownership before any mutation
- Return consistent, predictable response shapes
- Keep route handlers thin - push complex logic into separate services or utility functions.

## Data and Storage

- Project metadata and relationships belong in PostgreSQL via Prisma.
- Canvas snapshots and generated specs belong in vercel blob storage rather than the database; Prisma
  stores only references to these files rather than the files themselves.
- Dont store large generated content directly in the database; always use blob storage for such files.
- Task run records are first-class relational data and should be stored in PostgreSQL via Prisma -
  treat ownership and run ID's as verified before any token issuance.

## File Organization

- `lib/` — Utility functions, services, Prisma client, auth helpers, and other shared logic that doesn't belong in a specific feature folder.
- `components/` — Reusable UI components that can be shared across different pages and features, UI composition only no business logic.
- `pages/` — Next.js page components, including route handlers and server components.
- `styles/` — Global and component-specific styles, including Tailwind configuration and CSS custom properties.
- `public/` — Static assets such as images, fonts, and other files that need to be publicly accessible.
- `context/` — Project context and documentation files, including architecture and code standards.
- `features/` — Feature-specific modules containing components, hooks, and other logic related to a particular feature.
- `trigger/` - All durable triggers and AI workflows.
- `app/api/` — Next.js API route handlers for auth, triggering, persistence and other backend operations, including serverless functions and route-specific logic.
- Name files after the responsibility they fulfill not the technology, keeping names descriptive and aligned with the feature or module they belong to.
