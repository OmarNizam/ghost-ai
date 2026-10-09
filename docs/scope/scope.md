# Scope: Ghost AI

A real time collaborative system design workspace. You describe a system in plain English, an AI agent maps it onto a shared canvas, collaborators refine it together, and the AI turns the result into a Markdown technical spec. Built solo as a learning project, free, no billing.

**Build approach:** Tracer Bullet (prove one real thread through every layer, then thicken one segment at a time).
**Workflow:** Beta (after `/develop`, run `/check verify`, then `/test`). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· GA`) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & scaffold | Foundation | existing |
| 2 | Coding standards & tooling | Foundation | existing |
| 3 | Design system | Foundation | existing |
| 4 | Editor shell | Foundation | existing |
| 5 | Authentication | Foundation | existing |
| 6 | Data model | Foundation | planned |
| 7 | Error monitoring | Foundation | planned |
| 8 | Projects: create, list, open | Slice 1 | planned |
| 9 | Canvas editing | Slice 1 | planned |
| 10 | AI architecture generation | Slice 1 | planned |
| 11 | Spec generation | Slice 1 | planned |
| 12 | Realtime collaboration | Slice 2 | planned |
| 13 | Collaborator invites | Slice 3 | planned |
| 14 | Starter templates | Slice 4 | planned |
| 15 | Canvas snapshots | Slice 5 | planned |
| 16 | Spec review and versions | Slice 5 | planned |
| 17 | Product analytics | Slice 6 | planned |
| 18 | Legal pages and cookie consent | Slice 6 | planned |
| 19 | Accessibility pass | Slice 6 | planned |

## Foundations

### 1. Stack & scaffold · existing
Next.js 16 App Router with TypeScript, Tailwind v4, and shadcn/ui on Base UI, scaffolded before this workflow. code in `./`

### 2. Coding standards & tooling · existing
Root `AGENTS.md` and the `context/` docs hold the conventions; ESLint runs through `npm run lint`. code in `AGENTS.md`, `context/`, `eslint.config.mjs`

### 3. Design system · existing
Dark only token palette in `globals.css` mapped to Tailwind classes, plus the base shadcn components. Built from `context/feature-specs/01-design-system.md`. code in `app/globals.css`, `components/ui/`

### 4. Editor shell · existing
Navbar, sliding project sidebar with My and Shared Projects tabs (empty states for now), and the shared editor dialog. Built from `context/feature-specs/02-editor.md`. code in `components/editor/`, `app/editor/`

### 5. Authentication · existing
Clerk sign up, sign in, sign out, dark auth pages, and route protection in `proxy.ts`. Built from `context/feature-specs/03-auth.md`. A manual browser run through sign up to sign out is still listed as open in the progress tracker. code in `proxy.ts`, `app/(auth)/`, `lib/clerk-*.ts`

### 6. Data model · needs a decision
Relational records every later slice builds on: projects with a single owner, collaborators and roles, specs, and AI task runs, with references to large artifacts kept outside the database.
**Done when:** the schema supports projects, collaborators, specs, and task runs without a breaking migration later, and migrations apply cleanly on a fresh database.
- [ ] Design it (spec): `/architect data model`

### 7. Error monitoring · needs a decision
Catch runtime errors in the app and in background AI runs, so failures in generation are visible from day one.
**Done when:** an error thrown in a route, a page, or a background run shows up in one place with enough context to trace it.
- [ ] Design it (spec): `/architect error monitoring`

## Slice 1: Core loop (walking skeleton)

One real, narrow thread from a new project to a generated spec. Single user, no sharing, no templates, no history yet.

### 8. Projects: create, list, open · needs a decision
The New Project dialog creates a real project, My Projects lists it in the sidebar, and opening it loads its workspace route.
**Done when:** a signed in user can create a project, see it in My Projects, open it, and cannot open a project they do not own; empty and error states render.
- [ ] Design it (spec): `/architect projects`

### 9. Canvas editing · needs a decision
A canvas in the project workspace where you add, edit, connect, and delete system components, using one node and edge schema that templates and AI output will share.
**Done when:** you can add, rename, connect, and delete nodes, and the canvas survives a reload; controls are keyboard reachable.
- [ ] Design it (spec): `/architect canvas editing`

### 10. AI architecture generation · needs a decision
Describe a system in plain English and a durable background run lays out an initial architecture on the canvas, with the run tracked as a record.
**Done when:** a prompt produces nodes and edges on the canvas, the run status (running, done, failed) is visible, and a failed run leaves the canvas untouched.
- [ ] Design it (spec): `/architect ai architecture generation`

### 11. Spec generation · needs a decision
Turn the current canvas into a Markdown technical spec in a background run, store the file as an artifact, and show it in the workspace.
**Done when:** you can trigger generation, see its status, and read the resulting Markdown spec; the spec file lives in artifact storage with only its reference in the database.
- [ ] Design it (spec): `/architect spec generation`

## Slice 2: Realtime collaboration

### 12. Realtime collaboration · needs a decision
Several people on the same canvas at once: live edits, presence, and cursors, with access to a room granted only after checking project membership.
**Done when:** two signed in members see each other's cursors and edits live, and a non member cannot join the room.
- [ ] Design it (spec): `/architect realtime collaboration`

## Slice 3: Sharing

### 13. Collaborator invites · needs a decision · GA
The owner shares a project with other users at a role, and shared projects appear under Shared Projects.
**Done when:** the owner can add and remove a collaborator, the collaborator sees the project under Shared Projects with only their role's permissions, and denied access attempts are logged.
- [ ] Design it (spec): `/architect collaborator invites`

## Slice 4: Templates

### 14. Starter templates · needs a decision
Import a prebuilt architecture (monolith, microservices, event driven, serverless) onto the canvas as a starting point, using the same schema as user content.
**Done when:** you can pick a template and it loads onto the canvas as normal editable nodes, for every collaborator in the room.
- [ ] Design it (spec): `/architect starter templates`

## Slice 5: History

### 15. Canvas snapshots · needs a decision
Save snapshots of the canvas to artifact storage for recovery and version history.
**Done when:** you can save a snapshot, see the list of past snapshots, and restore one; snapshot files live in artifact storage with references in the database.
- [ ] Design it (spec): `/architect canvas snapshots`

### 16. Spec review and versions · needs a decision
Edit, approve, and keep earlier versions of generated specs alongside the project.
**Done when:** you can edit a generated spec, mark it approved, and open any earlier version; regenerating creates a new version instead of overwriting.
- [ ] Design it (spec): `/architect spec review and versions`

## Slice 6: Launch readiness

### 17. Product analytics · needs a decision
Measure the core loop: projects created, AI generations run, specs produced.
**Done when:** those three events are recorded per user and visible in a dashboard, and tracking respects cookie consent.
- [ ] Design it (spec): `/architect product analytics`

### 18. Legal pages and cookie consent · needs a decision
Privacy policy and terms pages reachable without signing in, plus a cookie consent banner that gates non essential tracking.
**Done when:** privacy and terms pages load signed out, consent is asked once and remembered, and declining blocks analytics.
- [ ] Design it (spec): `/architect legal pages and cookie consent`

### 19. Accessibility pass
Audit the auth pages, editor shell, dialogs, and canvas controls against WCAG AA and fix what fails. Each UI feature above already seeds keyboard support; this pass closes the gaps.
**Done when:** every screen is fully keyboard operable, has visible focus and correct labels, and meets AA contrast.
- [ ] Build it: `/develop accessibility pass`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **AI feedback loop**: let users rate generations to improve later ones · needs a decision
- **Permission change notifications**: tell collaborators when their access changes · needs a decision
- **Billing & plans**: paid tiers, if this ever ships beyond learning · needs a decision · GA

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | **`/architect` at spec capture** | `Design it` ticked; spec linked; `Build it: /develop <feature>` + **2 to 5 milestones**; the tier's closing boxes (`Verify it` Alpha+, `Test it` Beta+, `Review it` + `Document it` GA); any surfaced follow-up enrolled |
| `in-progress` (building) | `/develop` | milestone sub-boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | **you, when you decide it is** (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; the tier's last stage (`Prototype` → after `/develop`; `Alpha` → after `/check verify`; `Beta`/`GA` → after `/test`) is the suggested point to call it done; `/sync` captures conventions |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop`. The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre-workflow) and `dropped` (de-scoped, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag = inherits it.
- **Workflow tier tag** beside a heading (e.g. `· GA`, `· Prototype`) sets that one feature's rigor above or below the project default; no tag inherits the default. It decides the feature's check boxes and each skill's next suggestion.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing (trust develop's own build time self check); **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
