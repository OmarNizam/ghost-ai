import type { LucideIcon } from "lucide-react";
import { FileText, Ghost, Share2, Sparkles } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh flex-1 bg-page lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r border-surface-border bg-surface p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Ghost className="h-5 w-5 text-page" aria-hidden />
          </div>
          <span className="text-lg font-semibold text-copy-primary">Ghost AI</span>
        </div>

        <div className="flex max-w-xl flex-col gap-12">
          <div className="flex flex-col gap-5">
            <h1 className="max-w-md text-4xl leading-tight font-semibold tracking-tight text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="text-lg leading-relaxed text-copy-muted">
              Describe your architecture in plain English. Ghost AI maps it to a shared canvas
              your whole team can refine in real time.
            </p>
          </div>

          <ul className="flex flex-col gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border-subtle bg-brand-dim">
                  <Icon className="h-4 w-4 text-brand" aria-hidden />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-copy-secondary">{title}</p>
                  <p className="text-sm text-copy-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-copy-faint">
          © {new Date().getFullYear()} Ghost AI. All rights reserved.
        </p>
      </aside>

      <main className="flex items-center justify-center p-4">{children}</main>
    </div>
  );
}
