# Review, chore/remove-github-code-review-skill, 2026-10-09

**Reviewed by**: Claude Sonnet 5.5 (author on unspecified model)
**Scope**: 1 file, branch vs main (merge base b805ba6)
**Verdict**: Approve with nits

## Summary
Deletes `.github/skills/code-review/SKILL.md`, a Copilot PR review checklist, the only file under `.github/`. No code or runtime behavior changes. Repo-wide search (excluding node_modules, .git, .next) finds no references to the deleted path. Most of the checklist rules still live in `context/*.md`; a few small ones are now written down nowhere.

## Minor
### 🟡 Some review-only rules are now lost, `.github/skills/code-review/SKILL.md` (deleted)
**Problem**: Most rules are duplicated in `context/` (design tokens and no `zinc-*`, radius scale, Vercel Blob for artifacts, Liveblocks token gating, auth/validation at boundaries, no `any`, `use client` only when needed, `render` prop instead of `asChild` in `progress-tracker.md:36`, `EditorDialog` reuse in `progress-tracker.md:42`). These are not found anywhere else:
- Icon sizing (`h-4 w-4` inline, `h-5 w-5` in buttons) and `aria-hidden` on decorative icons.
- `cn` imported from `@/lib/utils`.
- Narrow-viewport and zoom resilience, with `max-w-*` / `max-h-*` caps.
- Hidden off-canvas panels must be `inert`; modals trap focus.
- "Check `node_modules/next/dist/docs/` before flagging unfamiliar APIs." This is partly covered by AGENTS.md.
- "Don't flag code that follows documented conventions."
**Why it matters**: `/check review` reads only AGENTS.md, specs and the diff. The accessibility and icon rules will no longer be enforced in review.
**Suggested fix**: If these rules matter, add a line or two to `context/ui-context.md` or `context/code-standards.md`. The review prompt already inlines AGENTS.md, which points at those files. Otherwise accept the loss.

## Nits
- ⚪ `context/feature-specs/` was referenced by the deleted skill as the spec source. `/check` mentions `docs/specs/`, which doesn't exist. Not caused by this change, but worth keeping the spec location consistent.
- ⚪ `.claude/skills/audit/agent-prompt.md:136` mentions `.github/workflows/` generically. It is unaffected and has no dangling reference.

## Strengths
- Clean, single-purpose commit with a clear message.
- No dangling references to the deleted path.
- Most project rules are already in `context/`, so there is little duplication left to drift.

## Test coverage
Not applicable (doc/config deletion). Test signal is none-yet; no code behavior changed, so no gap is introduced.
