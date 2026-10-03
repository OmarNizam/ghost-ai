"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { EditorDialog } from "@/components/editor/dialog";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";

interface EditorShellProps {
  children: ReactNode;
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="flex h-dvh flex-col bg-page">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNewProject={() => setIsDialogOpen(true)}
        />

        <main className="h-full">{children}</main>
      </div>

      <EditorDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title="New Project"
        description="Project creation is coming soon."
        footer={
          <>
            <Button variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={closeDialog}>Confirm</Button>
          </>
        }
      >
        <p className="text-sm">Dialog content goes here.</p>
      </EditorDialog>
    </div>
  );
}
