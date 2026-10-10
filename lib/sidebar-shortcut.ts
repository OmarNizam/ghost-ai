const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const CONTENT_EDITABLE_SELECTOR = '[contenteditable]:not([contenteditable="false"])';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (EDITABLE_TAGS.has(target.tagName)) return true;
  // jsdom lacks isContentEditable, so match the attribute on the target or an ancestor.
  return target.closest(CONTENT_EDITABLE_SELECTOR) !== null;
}

/**
 * True when a keydown should toggle the editor's project sidebar: Cmd + B or
 * Ctrl + B (either modifier on every platform), no Shift or Alt, not an
 * auto-repeat, and not typed into a text field or contenteditable region.
 */
export function isSidebarToggleShortcut(event: KeyboardEvent): boolean {
  if (event.key.toLowerCase() !== "b") return false;
  if (!event.metaKey && !event.ctrlKey) return false;
  if (event.shiftKey || event.altKey || event.repeat) return false;
  return !isEditableTarget(event.target);
}
