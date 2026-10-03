import { Ghost } from "lucide-react";

const features = [
  "Sketch system designs on a shared canvas",
  "Collaborate with your team in real time",
  "Generate technical specs with AI",
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh flex-1 bg-page lg:grid-cols-2">
      <aside className="hidden flex-col justify-center gap-6 border-r border-surface-border bg-surface px-12 lg:flex">
        <div className="flex items-center gap-2">
          <Ghost className="h-5 w-5 text-brand" aria-hidden />
          <span className="text-sm font-semibold text-copy-primary">Ghost AI</span>
        </div>
        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="text-2xl font-semibold text-copy-primary">
            Design systems together, ship specs faster.
          </h1>
          <p className="text-sm text-copy-muted">
            A collaborative workspace for architecture design.
          </p>
        </div>
        <ul className="flex flex-col gap-2 text-sm text-copy-secondary">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </aside>

      <main className="flex items-center justify-center p-4">{children}</main>
    </div>
  );
}
