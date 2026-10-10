VERDICT: PASS

## Findings

- nit, components/editor/editor-shell.tsx:20-32: Shortcut matches spec (Cmd/Ctrl+B, ignored in editable fields and while the dialog is open, default prevented only on match). The toggle has aria-keyshortcuts with its aria-label/expanded/controls unchanged. Same state as the button, so the icon and aria stay in sync.
- nit, lib/sidebar-shortcut.ts: No visible hint and no focus return. Both are out of scope per the spec.
