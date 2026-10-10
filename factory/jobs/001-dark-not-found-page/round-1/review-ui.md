VERDICT: PASS

## Findings

- nit: app/not-found.tsx:9 brand mark is text-brand on bg-brand-dim in an h-8 w-8 box with an h-4 w-4 icon; valid (tokens, rounded-xl), though it differs from the auth layout mark (bg-brand, rounded-lg, h-5 w-5). Optional.
- nit: app/not-found.tsx:25 the Link line is long; prettier may wrap it. No design impact.

Checked: only token classes (bg-page, text-copy-primary/muted, text-brand, bg-brand-dim, border-surface-border-subtle all exist in globals.css), no hex or raw palette. buttonVariants used, rounded-xl on the link, no asChild. Centered flex layout with max-w-sm, compact, one h1 inside main, aria-hidden icon.
