"use client";

import { FolderOpen, Plus, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProject: () => void;
}

export function ProjectSidebar({ isOpen, onClose, onNewProject }: ProjectSidebarProps) {
  return (
    <aside
      id="project-sidebar"
      aria-label="Projects"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "absolute inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-surface-border bg-surface shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-surface-border px-4">
        <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close sidebar">
          <X className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      <Tabs defaultValue="mine" className="min-h-0 flex-1 p-3">
        <TabsList className="w-full">
          <TabsTrigger value="mine">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          <EmptyState icon={FolderOpen} title="No projects yet" hint="Create a project to get started." />
        </TabsContent>
        <TabsContent value="shared">
          <EmptyState
            icon={Users}
            title="No shared projects"
            hint="Projects others share with you will appear here."
          />
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-3">
        <Button className="w-full" size="lg" onClick={onNewProject}>
          <Plus className="h-5 w-5" aria-hidden />
          New Project
        </Button>
      </div>
    </aside>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  hint: string;
}

function EmptyState({ icon: Icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-surface-border px-4 py-10 text-center">
      <Icon className="h-5 w-5 text-copy-faint" aria-hidden />
      <p className="text-sm font-medium text-copy-secondary">{title}</p>
      <p className="text-xs text-copy-muted">{hint}</p>
    </div>
  );
}
