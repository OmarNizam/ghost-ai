// Single entry point for class merging. `cn` (shadcn's drop-in replacement for
// clsx + tailwind-merge) joins conditional classes and resolves Tailwind conflicts.
// Always import from "@/lib/utils", never from "cn" directly.
export { cn } from "cn"
