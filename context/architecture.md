# Architecture Context

## Stack

| Layer            | Technology              | Role                                                           |
| ---------------- | ----------------------- | -------------------------------------------------------------- |
| Framework        | Next.js + TypeScript    | Full-stack app with server/client boundaries                   |
| UI               | Tailwind + shadcn/ui    | Components composition and styling                             |
| Auth             | Clerk                   | User identity and route protection                             |
| Database         | Prisma + PostgreSQL     | Relational metadata: projects, collaborators, specs, task runs |
| Canvas           | Liveblocks + React Flow | Real-time collaborative canvas, presence, and cursors          |
| Background tasks | Trigger.dev             | Durable AI generation workflows                                |
| Artifact Storage | Vercel Blob             | Canvas snapshots and generated Markdown specs                  |

## System Boundaries

- **Framework**: Next.js + TypeScript — Handles server/client boundaries and routing
- **UI**: Tailwind + shadcn/ui — Manages component composition and styling
- **Auth**: Clerk — Manages user identity and route protection
- **Database**: Prisma + PostgreSQL — Stores relational metadata: projects, collaborators, specs, task runs
- **Canvas**: Liveblocks + React Flow — Manages real-time collaborative canvas, presence, and cursors
- **Background tasks**: Trigger.dev — Handles durable AI generation workflows
- **Artifact Storage**: Vercel Blob — Stores canvas snapshots and generated Markdown specs
- **Storage Model**: Defines how and where different types of data are stored
- `app/api` - Authenticated request handlers: input validation, ownership checks, task triggering, persistence of business logic, and response formatting.
- `trigger` - Long-running background jobs and workflows managed by Trigger.dev: AI design generation and spec generation.
- `lib` - Shared utility functions, helpers, and abstractions used across the application.
- `components` - Reusable UI components used throughout the application or UI Composition: canvas, sidebars, dialogs and interactive elements.
- `context` - React context providers and hooks for managing global state and side effects.
- `pages` - Next.js page components that define the application's routes and server-side rendering logic.
- `public` - Static assets such as images, fonts, and other files that are publicly accessible.
- `Prisma` - Database client and ORM for interacting with the PostgreSQL database.
- `data` - Seed data and fixtures used to populate the database during development and testing. Legacy or initial data for the application. Not used for new artifacts.

## Storage Model

- **Database**: What lives here —
  metadata, ownership, relationships, and task run records.
- **Vercel Blob/File Storage**: What lives
  here — generated files, media, large artifacts, canvas snapshots at `canvas/{projectId}.json`
  and specs at `specs/{projectId}/{specId}.md`
- Project records, specs records, and task run records live in the database PostgreSQL.
- Canvas snapshots and generated Markdown specs live in Vercel Blob/File Storage stored and retrived from there.
- The Blob URL is stored in the database alongside the corresponding metadata for easy retrieval (canvasJsonPath, filePath) as reference to the artifact.

## Auth and Access Model

- How authentication works — Every user signs in
  via Clerk
- How ownership works — Every project has a single
  owner
- How access control works — Only the owner or a
  collaborator can mutate project resources
- Every project has a single owner (Clerk user ID)
- Collaborators are granted access to specific project resources based on their role and permissions.
- Projects can include additional collaborators who are granted access based on their role and permissions.
- Only authenticated useres can access protected routes and resources.
- Only the owner or collaborators with appropriate permissions can perform mutations on project resources.
- Access control checks are enforced at the API level to ensure that only authorized users can perform actions on project resources.
- Permissions are defined at the project level and dictate what actions collaborators can perform on project resources.
- The system ensures that unauthorized access attempts are logged and monitored for security purposes.
- Access control policies are reviewed and updated regularly to adapt to changing security requirements.
- Users are notified of any changes to access control policies that affect their permissions.
- Access control mechanisms are designed to be flexible and extensible to accommodate future changes in project collaboration requirements.
- Access control mechanisms are integrated with the application's logging and monitoring systems to provide visibility into access patterns and potential security issues.
- Access control mechanisms are tested regularly to ensure they function correctly and provide the intended level of security.
- Liveblocks room tokens are issued only after verifying the user's authentication, authorization status and verifying project membership.

## Invariants

1. Project resources must always have a single owner, and access control must be enforced consistently to ensure that only authorized users can perform mutations.
2. Canvas snapshots and generated Markdown specs must always be stored in Vercel Blob/File Storage, with their corresponding metadata stored in the database for easy retrieval.
3. Access control checks must be performed at the API level for all project resource mutations.
4. Unauthorized access attempts must be logged and monitored for security purposes.
5. Permissions must be defined at the project level and dictate what actions collaborators can perform on project resources.
6. Access control policies must be reviewed and updated regularly to adapt to changing security requirements.
7. Users must be notified of any changes to access control policies that affect their permissions.
8. Access control mechanisms must be tested regularly to ensure they function correctly and provide the intended level of security.
9. Liveblocks room tokens must only be issued after verifying the user's authentication, authorization status, and project membership.
10. Request handlers must validate all incoming requests to ensure they meet the required authentication, authorization, and data integrity standards before processing.
11. Background tasks or worker processes must handle long-lived AI work efficiently and ensure proper error handling and logging.
12. Mwtadata and large generated artifacts are stored in separate layers.
13. Auth and ownership are enforced at every mutation boundary.
14. Client components are used only where browser interactivity is required or real-time state requires them.
15. The Canvas schema must remain consistent between user-created content and imported templates, and backward-compatible to ensure that existing data and integrations continue to function correctly.
