# Sidebar toggle keyboard shortcut (Cmd/Ctrl + B)

## Goal

In the editor, pressing Cmd + B or Ctrl + B opens the project sidebar when it is closed and closes it when it is open. The shortcut uses the same state and toggle as the navbar's sidebar button, so the button icon, its `aria-expanded`, and the sidebar slide all stay in sync. This is one of the three parts of `docs/scope/scope.md` item 21 ("Editor shell polish").

## Scope

- `lib/sidebar-shortcut.ts` (new). Exports one pure function, `isSidebarToggleShortcut(event: KeyboardEvent): boolean`. It holds the key matching and the editable-target check, and it has no React and no side effects.
- `lib/sidebar-shortcut.test.ts` (new). Unit tests for the predicate.
- `components/editor/editor-shell.tsx`. Add one `useEffect` that registers a `keydown` listener on `window` (not `document`) and removes it in the cleanup function. On a match it calls `preventDefault()` and toggles with the existing functional updater `setIsSidebarOpen((open) => !open)`. It does nothing while the New Project dialog is open (see AC6).
- `components/editor/editor-shell.test.tsx` (new). Component tests for the wiring.
- `components/editor/editor-navbar.tsx`. Add `aria-keyshortcuts="Meta+B Control+B"` to the existing sidebar toggle `Button`. Nothing else in the file changes.
- `e2e/sidebar-shortcut.spec.ts` (new, optional but recommended). One signed-in browser test (see AC10).
- Docs: `context/feature-specs/NN-sidebar-toggle-shortcut.md` (a copy of this spec) and one Completed line in `context/progress-tracker.md`.

These files have no diff: `app/editor/layout.tsx`, `app/editor/page.tsx`, `proxy.ts`, `components/editor/project-sidebar.tsx`, `components/editor/dialog.tsx`, `components/ui/*`, `app/globals.css`, `package.json`. No new dependencies.

## Out of scope

- The other two parts of scope item 21: the "Welcome back, <first name>" greeting, and the `size-4` rule in `buttonVariants` that shrinks `h-5 w-5` button icons. Do not tick item 21 in `docs/scope/scope.md`, because this job covers only one of its three parts.
- Escape to close the sidebar, and any other new shortcut.
- A tooltip or visible shortcut hint such as "⌘B" or "Ctrl+B". There is no Tooltip component yet, and a platform-specific label needs platform detection, which risks a hydration mismatch. `aria-keyshortcuts` is the only hint in this job.
- Platform detection in general. Either modifier works on every OS (see AC1).
- User-configurable key bindings, and a shared shortcut registry or hook library.
- Focus return. If focus is inside the sidebar when it closes, the sidebar becomes `inert` and focus falls back to `body`. The sidebar's X button already behaves this way today. Fixing focus return for every close path belongs to the accessibility pass in `docs/scope/scope.md` ("every screen is fully keyboard operable"). It is a known limitation, not a defect of this job.
- Moving focus into the sidebar when the shortcut opens it. Focus stays where it was, the same as when the navbar button opens it.
- Persisting the open/closed state across reloads.

## Acceptance criteria

Unit and component tests (`npm test`) are the authoritative proof for AC1 to AC9.

- [ ] AC1: Key match. `isSidebarToggleShortcut` returns `true` when `event.key.toLowerCase() === "b"` and either `metaKey` or `ctrlKey` is held. Both `"b"` and `"B"` match (for example with Caps Lock on). Either modifier is accepted on every platform. The function does not read `navigator.platform` or `userAgent`. It uses `event.key`, not the deprecated `keyCode`.
- [ ] AC2: Not a match. It returns `false` for:
  - plain `b` with no modifier
  - Cmd/Ctrl + B with `shiftKey` held (Chrome uses Cmd/Ctrl + Shift + B for the bookmarks bar)
  - Cmd/Ctrl + B with `altKey` held
  - Cmd/Ctrl + any other key, for example `k`
  - an auto-repeat event (`event.repeat === true`)
- [ ] AC3: Editable targets are ignored. The function returns `false` when `event.target` is an `Element` and either:
  - it is an `input`, `textarea`, or `select` element, or
  - `target.closest('[contenteditable]:not([contenteditable="false"])')` is non-null, meaning it is inside a contenteditable element.

  The `closest(...)` check is required. `isContentEditable` may be added alongside it but cannot replace it, because jsdom does not implement `isContentEditable` (see Notes). In a text field Cmd/Ctrl + B means bold or a cursor move, and future prompt and label fields must keep it. A target that is not an Element, such as `window` or `document`, does not throw: the editable check is skipped and the key rules from AC1 and AC2 decide.
- [ ] AC4: Toggling works in the shell. With `EditorShell` rendered (sidebar closed at start), pressing Ctrl + B opens the sidebar and pressing it again closes it. Meta + B does the same. "Open" means the navbar toggle has `aria-expanded="true"` and `#project-sidebar` has neither `inert` nor `aria-hidden="true"`. "Closed" means the reverse. The navbar toggle and the shortcut stay in sync: open with the button, close with the shortcut, and the reverse.
- [ ] AC5: The browser default is suppressed only on a match. A matching keydown has its default prevented, so `fireEvent.keyDown(document.body, { key: "b", ctrlKey: true })` returns `false`. The event bubbles to the `window` listener. An ignored keydown (AC2, AC3, AC6) is not prevented and returns `true`.
- [ ] AC6: The shortcut does nothing while the New Project dialog is open. Open the sidebar, click "New Project" to open the dialog, then press Ctrl + B (dispatch on `document.body` or the focused element inside the dialog). The sidebar stays open and the default is not prevented. The listener can read the state through an effect dependency on `isDialogOpen` or through a ref. The effect still re-registers cleanly with no duplicate listeners: one press toggles exactly once.
- [ ] AC7: The listener is removed on unmount. A test spies on `window.addEventListener` and `window.removeEventListener` and checks that the same `"keydown"` handler that was added is removed after `unmount()`. Optionally, it also checks that after `unmount()` a Ctrl + B keydown on `document.body` is not prevented.
- [ ] AC8: The navbar toggle advertises the shortcut. The sidebar toggle button in `editor-navbar.tsx` has `aria-keyshortcuts="Meta+B Control+B"`, and its existing `aria-label`, `aria-expanded` and `aria-controls` are unchanged.
- [ ] AC9: The shortcut is editor-only. The listener lives in `EditorShell`, which mounts only through `app/editor/layout.tsx`. No listener is added to `app/layout.tsx`, `app/(auth)/*`, `app/not-found.tsx`, or any other root-level file. Reviewers check this by reading the diff.
- [ ] AC10 (e2e, optional): `e2e/sidebar-shortcut.spec.ts` signs in with `clerk.signIn` (same pattern as `e2e/not-found.spec.ts`) and opens `/editor`. It finds the navbar toggle with `page.locator('[aria-controls="project-sidebar"]')`, because its accessible name flips between "Open sidebar" and "Close sidebar" and the sidebar's X button is also named "Close sidebar". It presses `ControlOrMeta+b` and expects the toggle to have `aria-expanded="true"`, then presses again and expects `"false"`. The test is wrapped in `test.skip(!process.env.E2E_CLERK_USER_EMAIL, ...)`. A skip when that variable is unset does not block approval, because AC4 to AC7 are the authoritative proof.
- [ ] AC11: `npm test` passes, including the new `lib/sidebar-shortcut.test.ts` and `components/editor/editor-shell.test.tsx`.
- [ ] AC12: `npx next typegen && npx tsc --noEmit` passes.
- [ ] `npm run lint` and `npm run build` pass
- [ ] Spec copied to `context/feature-specs/NN-sidebar-toggle-shortcut.md` and a line added to `context/progress-tracker.md`. NN is the next free two-digit number. `01` to `04` exist, so this is currently `05`, and the builder confirms it.

## Notes

- Component-test gotchas:
  - `EditorNavbar` imports `UserButton` from `@clerk/nextjs`. Rendering `EditorShell` in jsdom without a `ClerkProvider` will fail, so mock it at the top of the test: `vi.mock("@clerk/nextjs", () => ({ UserButton: () => null }))`.
  - Dispatch shell keydowns on `document.body` or on a focused element, not on `window`. Those events bubble up to the `window` listener and carry a real Element target. An event dispatched directly on `window` reaches only `window` listeners. Use `fireEvent.keyDown(window, ...)` only in the predicate's "target that is not an Element does not throw" case.
  - When the sidebar is open there are two buttons named "Close sidebar": the navbar toggle and the sidebar's X. `getByRole("button", { name: "Close sidebar" })` throws on the duplicate. Find the navbar toggle by `aria-controls="project-sidebar"` (for example `container.querySelector('[aria-controls="project-sidebar"]')`), or assert on `#project-sidebar`'s `inert` / `aria-hidden` attributes.
  - The closed `<aside>` is `aria-hidden`, so `getByRole("complementary")` will not find it. Use `document.getElementById("project-sidebar")`.
  - AC6: while the Base UI modal is open, it hides or inerts content outside its portal, so role queries for the navbar toggle or the sidebar will miss them. In that test, use `querySelector('[aria-controls="project-sidebar"]')` / `document.getElementById("project-sidebar")` with `getAttribute`. The dialog is a portal: after clicking "New Project", wait for it with `await screen.findByRole("dialog")` before you press the shortcut.
  - `fireEvent.keyDown(target, init)` returns `false` when a handler called `preventDefault()`. Use that for AC5 and AC6. For realistic key presses, `userEvent.keyboard("{Control>}b{/Control}")` and `"{Meta>}b{/Meta}"` also work, because they dispatch on the focused element or `body`.
  - jsdom does not implement `HTMLElement.isContentEditable` (it is absent from `node_modules/jsdom/lib`), so a predicate that relies on it alone passes or fails the contenteditable test by accident. Use the `closest('[contenteditable]:not([contenteditable="false"])')` check required by AC3.
  - For AC3 at the shell level, pass `<input aria-label="probe" />` as `EditorShell`'s `children`, focus it, press Ctrl + B, and expect the sidebar to stay closed. The predicate tests can build events with `new KeyboardEvent("keydown", {...})` and dispatch them on a real element (an `input`, a `textarea`, a `select`, a child of `<div contenteditable="true">`, and a child of `<div contenteditable="false">` as the negative case) so that `event.target` is set. Alternatively, use `Object.defineProperty(event, "target", { value: el })`.
- Follow the `app/not-found.test.tsx` style: Vitest globals are off, so import `describe`/`it`/`expect`/`vi` from `vitest`. Put a `// Spec: context/feature-specs/NN-sidebar-toggle-shortcut.md` comment at the top and name the ACs in the test titles.
- `EditorShell` is already a client component (`"use client"`). Keep `app/editor/layout.tsx` a server component (`code-standards.md`, `architecture.md` invariant 14). `lib/sidebar-shortcut.ts` has no directive because it is a plain function.
- Keep modules small and single-purpose (`code-standards.md`). The predicate goes in `lib/` because it is shared logic with no UI. `components/` stays UI composition. Use `interface` for any object types and avoid `any`. Type the handler parameter as `KeyboardEvent` (the DOM type, not React's). Narrow `event.target` with `instanceof Element` before calling `closest` or reading `tagName`.
- Use the functional updater so the handler never reads a stale `isSidebarOpen`. Do not add a second piece of sidebar state.
- shadcn here is Base UI, not Radix (`AGENTS.md`): no `asChild`. Import `cn` only from `@/lib/utils`. No styling changes are expected in this job, so no new token classes are needed.
- Next.js 16 rule (`AGENTS.md`): read the relevant guide in `node_modules/next/dist/docs/` before relying on any Next API. This job uses only React and DOM APIs.
- Signed-in e2e tests need `E2E_CLERK_USER_EMAIL` in `.env.local` (the dev instance has `e2e+clerk_test@example.com`). `.env.local` is user-edit only, so do not read or modify it.
