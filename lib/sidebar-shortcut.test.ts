import { afterEach, describe, expect, it } from "vitest";

import { isSidebarToggleShortcut } from "./sidebar-shortcut";

// Spec: context/feature-specs/05-sidebar-toggle-shortcut.md

/** Dispatches a keydown on `target` so `event.target` is set, then runs the predicate. */
function check(init: KeyboardEventInit, target: EventTarget = document.body): boolean {
  let result: boolean | undefined;
  const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  const listener = (e: Event) => {
    result = isSidebarToggleShortcut(e as KeyboardEvent);
  };
  target.addEventListener("keydown", listener);
  target.dispatchEvent(event);
  target.removeEventListener("keydown", listener);
  if (result === undefined) throw new Error("listener did not run");
  return result;
}

function mount<T extends HTMLElement>(el: T): T {
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("isSidebarToggleShortcut", () => {
  describe("key match (AC1)", () => {
    it("matches Ctrl + b", () => {
      expect(check({ key: "b", ctrlKey: true })).toBe(true);
    });

    it("matches Meta + b", () => {
      expect(check({ key: "b", metaKey: true })).toBe(true);
    });

    it("matches an uppercase B (Caps Lock on) with either modifier", () => {
      expect(check({ key: "B", ctrlKey: true })).toBe(true);
      expect(check({ key: "B", metaKey: true })).toBe(true);
    });

    it("matches with both Meta and Ctrl held", () => {
      expect(check({ key: "b", metaKey: true, ctrlKey: true })).toBe(true);
    });

    it("decides by event.key, not keyCode", () => {
      expect(check({ key: "b", keyCode: 75, ctrlKey: true } as KeyboardEventInit)).toBe(true);
      expect(check({ key: "k", keyCode: 66, ctrlKey: true } as KeyboardEventInit)).toBe(false);
    });
  });

  describe("not a match (AC2)", () => {
    it("rejects a plain b with no modifier", () => {
      expect(check({ key: "b" })).toBe(false);
    });

    it("rejects Cmd/Ctrl + Shift + B (Chrome bookmarks bar)", () => {
      expect(check({ key: "B", ctrlKey: true, shiftKey: true })).toBe(false);
      expect(check({ key: "B", metaKey: true, shiftKey: true })).toBe(false);
    });

    it("rejects Cmd/Ctrl + Alt + B", () => {
      expect(check({ key: "b", ctrlKey: true, altKey: true })).toBe(false);
      expect(check({ key: "b", metaKey: true, altKey: true })).toBe(false);
    });

    it("rejects Cmd/Ctrl + another key", () => {
      expect(check({ key: "k", ctrlKey: true })).toBe(false);
      expect(check({ key: "k", metaKey: true })).toBe(false);
    });

    it("rejects an auto-repeat keydown", () => {
      expect(check({ key: "b", ctrlKey: true, repeat: true })).toBe(false);
    });
  });

  describe("editable targets (AC3)", () => {
    it("ignores an input", () => {
      expect(check({ key: "b", ctrlKey: true }, mount(document.createElement("input")))).toBe(false);
    });

    it("ignores a textarea", () => {
      expect(check({ key: "b", ctrlKey: true }, mount(document.createElement("textarea")))).toBe(
        false,
      );
    });

    it("ignores a select", () => {
      expect(check({ key: "b", metaKey: true }, mount(document.createElement("select")))).toBe(false);
    });

    it("ignores a contenteditable element and its descendants", () => {
      const editor = mount(document.createElement("div"));
      editor.setAttribute("contenteditable", "true");
      const child = document.createElement("span");
      editor.appendChild(child);

      expect(check({ key: "b", ctrlKey: true }, editor)).toBe(false);
      expect(check({ key: "b", ctrlKey: true }, child)).toBe(false);
    });

    it("ignores a bare contenteditable attribute (empty value)", () => {
      const editor = mount(document.createElement("div"));
      editor.setAttribute("contenteditable", "");
      const child = document.createElement("span");
      editor.appendChild(child);

      expect(check({ key: "b", ctrlKey: true }, child)).toBe(false);
    });

    it("still matches inside contenteditable=\"false\"", () => {
      const region = mount(document.createElement("div"));
      region.setAttribute("contenteditable", "false");
      const child = document.createElement("span");
      region.appendChild(child);

      expect(check({ key: "b", ctrlKey: true }, child)).toBe(true);
    });

    it("still matches on a non-editable element such as a button", () => {
      expect(check({ key: "b", ctrlKey: true }, mount(document.createElement("button")))).toBe(true);
    });

    it("does not throw for a non-Element target (window, document)", () => {
      expect(() => check({ key: "b", ctrlKey: true }, window)).not.toThrow();
      expect(check({ key: "b", ctrlKey: true }, window)).toBe(true);
      expect(check({ key: "b", metaKey: true }, document)).toBe(true);
      expect(check({ key: "b" }, window)).toBe(false);
    });
  });
});
