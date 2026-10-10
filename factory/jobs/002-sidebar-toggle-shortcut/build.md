# Build: 002-sidebar-toggle-shortcut

Branch `factory/002-sidebar-toggle-shortcut` (worktree `.claude/worktrees/factory-002-sidebar-toggle-shortcut`), cut from `origin/develop` at `0888efb`.

Commits:
- `d792b58` feat(editor): toggle the project sidebar with Cmd/Ctrl + B
- `11a93ae` docs(context): add 05 sidebar toggle shortcut spec and tracker line
- `7341749` test(editor-shell): only count keydown removals made by unmount (AC7)

## What changed

| File | Change |
| --- | --- |
| `lib/sidebar-shortcut.ts` (new) | Pure `isSidebarToggleShortcut(event: KeyboardEvent): boolean`. No directive, no React, no side effects. Uses `event.key.toLowerCase() === "b"`, `metaKey \|\| ctrlKey`, rejects `shiftKey`/`altKey`/`repeat`. Narrows `event.target` with `instanceof Element`, then rejects `INPUT`/`TEXTAREA`/`SELECT` and `closest('[contenteditable]:not([contenteditable="false"])')`. Does not read `navigator`, `keyCode` or `isContentEditable`. |
| `lib/sidebar-shortcut.test.ts` (new) | 18 predicate tests (AC1 to AC3), events dispatched on real elements so `event.target` is set. |
| `components/editor/editor-shell.tsx` | One `useEffect` with dependency `[isDialogOpen]`: returns early while the dialog is open; otherwise adds a `keydown` listener on `window`, which on a match calls `preventDefault()` and `setIsSidebarOpen((open) => !open)`, and removes the same handler in cleanup. No new state. |
| `components/editor/editor-shell.test.tsx` (new) | 9 component tests (AC3 to AC8). Mocks `@clerk/nextjs` `UserButton`. Finds the navbar toggle by `[aria-controls="project-sidebar"]` and the sidebar by id. |
| `components/editor/editor-navbar.tsx` | One line: `aria-keyshortcuts="Meta+B Control+B"` on the sidebar toggle. |
| `e2e/sidebar-shortcut.spec.ts` (new) | Signed-in Playwright test (AC10), skipped when `E2E_CLERK_USER_EMAIL` is unset. |
| `context/feature-specs/05-sidebar-toggle-shortcut.md` (new) | Copy of `spec.md`. `05` confirmed: root and worktree both have `01` to `04` only. |
| `context/progress-tracker.md` | One line added at the top of `## Completed`. |

Files listed in the spec as "no diff" have no diff: `git diff --stat origin/develop` touches only the 8 files above (`app/*`, `proxy.ts`, `project-sidebar.tsx`, `dialog.tsx`, `components/ui/*`, `globals.css`, `package.json` untouched). No new dependencies.

## Acceptance criteria

| AC | Evidence |
| --- | --- |
| AC1 key match | `lib/sidebar-shortcut.test.ts` "key match (AC1)": Ctrl+b, Meta+b, `B` with either modifier, both modifiers, and a `keyCode`-vs-`key` case showing `key` decides. Source reads only `event.key` (no `navigator`, no `keyCode`). |
| AC2 not a match | "not a match (AC2)": plain b, Ctrl/Meta+Shift+B, Ctrl/Meta+Alt+B, Ctrl/Meta+K, `repeat: true`, all `false`. |
| AC3 editable targets | "editable targets (AC3)": input, textarea, select, `contenteditable="true"` element and child, bare `contenteditable=""` child, all `false`; child of `contenteditable="false"` and a button `true`; `window` and `document` targets do not throw and fall through to key rules. Shell level: "ignores the shortcut inside a text field" focuses `<input aria-label="probe" />` children, presses Ctrl+B via `userEvent`, sidebar stays closed. Mutation check: replacing the `closest(...)` line with `return false` fails 2 tests. |
| AC4 toggling in the shell | `editor-shell.test.tsx`: Ctrl+B open/close via `fireEvent` on `document.body`; Meta+B open/close via `userEvent.keyboard("{Meta>}b{/Meta}")`; "stays in sync with the navbar button" (button opens, shortcut closes, shortcut opens, button closes). Open/closed asserted on toggle `aria-expanded` and `#project-sidebar` `inert` / `aria-hidden`. |
| AC5 default suppressed only on a match | "prevents the browser default only on a match": `fireEvent.keyDown(document.body, Ctrl+B)` returns `false`; plain b, +Shift, +Alt, Ctrl+K, repeat return `true`. Text-field test asserts `fireEvent.keyDown(input, Ctrl+B)` returns `true`. |
| AC6 off while dialog open | "does nothing while the New Project dialog is open": opens sidebar, clicks New Project, `await screen.findByRole("dialog")`, Ctrl+B on `document.body` and on `document.activeElement` both return `true`, sidebar stays open. "re-registers cleanly after the dialog closes": after Cancel, one Ctrl+B returns `false` and toggles exactly once (open to closed). Mutation check: removing the `if (isDialogOpen) return;` guard fails the AC6 test. |
| AC7 listener removed on unmount | "removes the same keydown listener from window on unmount": spies on `window.addEventListener` / `removeEventListener`, exactly one `keydown` handler added on mount, the remove spy is cleared, then the same handler is in the remove calls after `unmount()`, and a later Ctrl+B is not prevented. |
| AC8 navbar advertises shortcut | "EditorNavbar sidebar toggle (AC8)": `aria-keyshortcuts="Meta+B Control+B"`, `aria-label="Open sidebar"`, `aria-expanded="false"`, `aria-controls="project-sidebar"`. Diff of `editor-navbar.tsx` is one added line. |
| AC9 editor-only | Listener is only in `components/editor/editor-shell.tsx`; no `app/*` file is in the diff. |
| AC10 e2e | `npx playwright test e2e/sidebar-shortcut.spec.ts`: **1 passed** (7.7s). It ran signed in, not skipped. |
| AC11 `npm test` | 3 files, 35 tests passed (8 existing not-found + 18 predicate + 9 shell). |
| AC12 type check | `npx next typegen && npx tsc --noEmit`: exit 0. |
| lint / build | `npm run lint`: exit 0 (captured directly, not through a pipe), no warnings. `npm run build`: exit 0, compiled, TypeScript passed, all 5 routes generated. `npm test`: exit 0. Re-run after the last commit. |
| Docs | `context/feature-specs/05-sidebar-toggle-shortcut.md` and one Completed line in `context/progress-tracker.md`. |

## Open items

- None blocking. Known limitations are the ones the spec lists as out of scope (no focus return when the sidebar closes with focus inside it, no visible shortcut hint, scope item 21 not ticked).
- Design note: the dialog check uses the effect dependency on `isDialogOpen` (one of the two options the spec allows), so the listener is removed while the dialog is open and re-added when it closes.
