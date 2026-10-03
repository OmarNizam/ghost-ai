"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

/**
 * Shared modal frame for editor dialogs. Built on the shadcn Dialog (Base UI),
 * which provides the portal, focus trap, Escape-to-close, and focus restoration.
 */
export function EditorDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: EditorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[420px] max-h-[calc(100dvh-2rem)] w-[520px] max-w-[calc(100%-2rem)] flex-col gap-0 rounded-3xl border border-surface-border bg-elevated p-0 duration-200 sm:max-w-[520px] data-open:slide-in-from-bottom-4 data-closed:slide-out-to-bottom-4"
      >
        <div className="flex items-start justify-between gap-4 border-b border-surface-border px-6 py-4">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-base font-semibold text-copy-primary">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-copy-muted">{description}</DialogDescription>
            )}
          </div>
          <DialogClose
            render={<Button variant="ghost" size="icon-sm" aria-label="Close dialog" />}
          >
            <X className="h-4 w-4" aria-hidden />
          </DialogClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-copy-secondary">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-surface-border px-6 py-4">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
