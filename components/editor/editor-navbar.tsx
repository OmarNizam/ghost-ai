"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Ghost, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-surface px-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          aria-controls="project-sidebar"
          aria-keyshortcuts="Meta+B Control+B"
        >
          <ToggleIcon className="h-5 w-5" aria-hidden />
        </Button>
      </div>

      <nav className="flex items-center gap-1" aria-label="Editor">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-copy-primary hover:bg-subtle"
        >
          <Ghost className="h-4 w-4 text-brand" aria-hidden />
          Ghost AI
        </Link>
      </nav>

      <div className="flex items-center justify-end gap-2">
        <UserButton />
      </div>
    </header>
  );
}
