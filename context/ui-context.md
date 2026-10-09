# UI Context

## Theme

Dark only.
No light mode. The design language is a dark technical
workspace — near-black backgrounds, layered surfaces,
and vivid accent colors for interactive elements

## Colors

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind Tokens
via `@theme inline`.
Components must use these tokens — no hardcoded hex values or raw Tailwind color classes like `zinc-*`.

| Role             | CSS Variable         | Value                     |
| ---------------- | -------------------- | ------------------------- |
| Page background  | `--bg-base`          | `#080809`                 |
| Surface          | `--bg-surface`       | `#111114`                 |
| Elevated surface | `--bg-elevated`      | `#18181c`                 |
| Subtle surface   | `--bg-subtle`        | `#1e1e23`                 |
| Default border   | `--border-default`   | `#2a2a30`                 |
| subtel border    | `--border-subtle`    | `#3a3a42`                 |
| Primary text     | `--text-primary`     | `#f0f0f4`                 |
| Secondary text   | `--text-secondary`   | `#c0c0cc`                 |
| Muted text       | `--text-muted`       | `#808090`                 |
| Faint text       | `--text-faint`       | `#505060`                 |
| Brand accent     | `--accent-brand`     | `#00c8d4` (cyan)          |
| Brand dim        | `--accent-brand-dim` | `rgba(0, 200, 212, 0.12)` |
| AI accent        | `--accent-ai`        | `#6457f9` (indigo-purple) |
| AI text          | `--text-ai`          | `#8b82ff`                 |
| Primary accent   | `--accent-primary`   | `#2a2a30`                 |
| Border           | `--border-default`   | `#1e1e23`                 |
| Error            | `--state-error`      | `#ff4d4f`                 |
| Success          | `--state-success`    | `#34d399`                 |
| Warning          | `--state-warning`    | `#fbbf24`                 |

Tailwind utilities map to these variables via the `@theme inline` directive in `app/globals.css`. Use the named classes, not `bg-[var(...)]` arbitrary values. For example, `bg-page` applies the page background (`--bg-base`; the class is `page`, not `base`, because `--color-base` would clash with Tailwind's `text-base` font size).
Surfaces: `bg-surface`, `bg-elevated`, `bg-subtle`. Borders: `border-surface-border`, `border-surface-border-subtle`. Text: `text-copy-primary`, `text-copy-secondary`, `text-copy-muted`, `text-copy-faint`, `text-copy-ai`.
For accent colors, use `brand`, `brand-dim` and `ai` (for example `bg-brand`, `bg-brand-dim`, `text-brand`, `bg-ai`). `--accent-primary` reaches Tailwind through shadcn's `accent` (`bg-accent`).
For state colors, use `state-error`, `state-success` and `state-warning` (for example `text-state-error`).

## Typography

| Role      | Font        | CSSVariable         |
| --------- | ----------- | ------------------- |
| UI text   | Geist Sans  | `--font-geist-sans` |
| Code/mono | Geist Mono. | `--font-geist-mono` |

Both fonts are loaded via `next/font/google` and assigned to the respective CSS variables
on the `<html>` element. The base `body` uses Geist Sans with `antialiased` as the default font.

## Border Radius

| Context           | Class         |
| ----------------- | ------------- |
| Inline / small UI | `rounded-xl`  |
| Cards / panels    | `rounded-2xl` |
| Modals / overlays | `rounded-3xl` |

## Component Library

shadcn/ui on top of Tailwind. Components live
in components/ui/.
Use the CLI to add new components
rather than writing from scratch.

## Layout Patterns

- Editor: full-viewport split withleft sidebar, center canvas, right sidebar
- Sidebars: fixed width with border separator
- Modals: centered overlay with backdrop blur
- Navbar: top bar with bottom border

## Icons

Lucide React. Stroke-based icons only.
Sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons.

## Canvas

The main working area of the application, typically centered in the viewport.
It should be flexible to accommodate various content types and responsive to different screen sizes.

### Node Color Palette

| Role     | CSS Variable         | Color     |
| -------- | -------------------- | --------- |
| Default  | `--node-bg-default`  | `#1e1e23` |
| Selected | `--node-bg-selected` | `#2a2a30` |
| Hover    | `--node-bg-hover`    | `#34343a` |
| Error    | `--node-bg-error`    | `#ff4d4f` |
| Success  | `--node-bg-success`  | `#34d399` |
| Warning  | `--node-bg-warning`  | `#fbbf24` |

## Node States

| State   | CSS Variable           | Color     |
| ------- | ---------------------- | --------- |
| Error   | `--node-state-error`   | `#ff4d4f` |
| Success | `--node-state-success` | `#34d399` |
| Warning | `--node-state-warning` | `#fbbf24` |

## Node Sizes

| Size        | CSS Variable         | Dimensions |
| ----------- | -------------------- | ---------- |
| Small       | `--node-size-small`  | `40px`     |
| Medium      | `--node-size-medium` | `60px`     |
| Large       | `--node-size-large`  | `80px`     |
| Extra Large | `--node-size-xl`     | `100px`    |

## Edge Styles

| Style    | CSS Variable            | Description             |
| -------- | ----------------------- | ----------------------- |
| Default  | `--edge-style-default`  | Standard edge style     |
| Selected | `--edge-style-selected` | Edge when selected      |
| Hover    | `--edge-style-hover`    | Edge on hover           |
| Error    | `--edge-style-error`    | Edge indicating error   |
| Success  | `--edge-style-success`  | Edge indicating success |
| Warning  | `--edge-style-warning`  | Edge indicating warning |
