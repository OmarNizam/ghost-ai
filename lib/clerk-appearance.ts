import type { Appearance } from "@clerk/ui";
import { dark } from "@clerk/ui/themes";

// Clerk's dark theme with its variables mapped onto the Ghost AI tokens in
// app/globals.css, so Clerk components follow the app palette without hardcoded values.
export const clerkAppearance: Appearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-brand)",
    colorPrimaryForeground: "var(--bg-base)",
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorNeutral: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorInput: "var(--bg-subtle)",
    colorInputForeground: "var(--text-primary)",
    // Clerk renders borders as colorBorder at ~7–11% alpha, so a light token is needed for
    // them to land near --border-default on the dark surfaces.
    colorBorder: "var(--text-primary)",
    colorRing: "var(--accent-brand)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "1rem",
    borderRadius: "var(--radius)",
  },
  options: {
    socialButtonsVariant: "blockButton",
  },
  elements: {
    // Stack social buttons one per row so the full "Continue with …" label fits.
    socialButtons: { gridTemplateColumns: "1fr" },
  },
};
