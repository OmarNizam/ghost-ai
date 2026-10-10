import Link from "next/link";
import { Ghost } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-page p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-border-subtle bg-brand-dim">
          <Ghost className="h-4 w-4 text-brand" aria-hidden />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-brand">404</p>
          <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">
            Page not found
          </h1>
          <p className="text-sm text-copy-muted">
            This page does not exist or has moved.
          </p>
        </div>

        <Link href="/editor" className={cn(buttonVariants({ size: "lg" }), "rounded-xl px-4")}>
          Back to editor
        </Link>
      </div>
    </main>
  );
}
