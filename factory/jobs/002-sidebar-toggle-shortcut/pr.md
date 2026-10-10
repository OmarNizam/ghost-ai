## Summary

Adds a Cmd/Ctrl + B keyboard shortcut that opens and closes the project sidebar in the editor. It uses the same state as the navbar toggle button, so the icon, `aria-expanded` and the slide stay in sync.

- Both Cmd + B and Ctrl + B work on every OS. Shift or Alt held, auto-repeat and other keys are ignored.
- It does nothing inside `input`, `textarea`, `select` or contenteditable elements, where Cmd/Ctrl + B means bold or a cursor move.
- It does nothing while the New Project dialog is open.
- `preventDefault()` runs only when the shortcut fires.
- The listener lives only in `EditorShell`, so it exists only on `/editor` routes, and it is removed on unmount.
- The navbar toggle advertises the shortcut with `aria-keyshortcuts="Meta+B Control+B"`.

Files changed (8):
- `lib/sidebar-shortcut.ts` (new): the pure `isSidebarToggleShortcut(event)` check
- `lib/sidebar-shortcut.test.ts` (new): 18 tests for the check
- `components/editor/editor-shell.tsx`: one `useEffect` with the `window` keydown listener
- `components/editor/editor-shell.test.tsx` (new): 9 component tests
- `components/editor/editor-navbar.tsx`: adds the `aria-keyshortcuts` attribute
- `e2e/sidebar-shortcut.spec.ts` (new): signed-in Playwright test
- `context/feature-specs/05-sidebar-toggle-shortcut.md` (new): the spec
- `context/progress-tracker.md`: one Completed line

No new dependencies. `app/*` and `proxy.ts` are unchanged.

Out of scope, per the spec: a visible shortcut hint, Escape to close the sidebar, returning focus when the sidebar closes with focus inside it, and the other parts of scope item 21.

## Reviews

| Round | security | ux | ui | code |
| --- | --- | --- | --- | --- |
| 1 | PASS | PASS | PASS | PASS |

**Decision: APPROVE.** Every acceptance criterion has passing test evidence. Round 1 is all PASS (code, security, ui and ux), and the 8-file diff stays inside the spec's scope, with no dependency, schema, auth, data or `proxy.ts` change.

## Test plan

- [x] AC1: Cmd/Ctrl + B (`b` or `B`) matches on every platform, decided by `event.key`
- [x] AC2: plain B, Shift or Alt held, other keys and auto-repeat do not match
- [x] AC3: input, textarea, select and contenteditable targets are ignored, and non-Element targets do not throw
- [x] AC4: the shortcut opens and closes the sidebar in `EditorShell` and stays in sync with the navbar toggle
- [x] AC5: the browser default is prevented only on a match
- [x] AC6: the shortcut does nothing while the New Project dialog is open, and the listener re-registers cleanly after it closes
- [x] AC7: the keydown listener is removed on unmount
- [x] AC8: the navbar toggle has `aria-keyshortcuts="Meta+B Control+B"`, and its other aria attributes are unchanged
- [x] AC9: the listener exists only in `EditorShell` (editor routes only)
- [x] AC10: the signed-in e2e test `e2e/sidebar-shortcut.spec.ts` passed
- [x] AC11: `npm test` passed (35/35)
- [x] AC12: `npx next typegen && npx tsc --noEmit` passed
- [x] `npm run lint` and `npm run build` passed
- [x] spec copied to `context/feature-specs/05-sidebar-toggle-shortcut.md` and a progress-tracker line added

🤖 Generated with [Claude Code](https://claude.com/claude-code)
