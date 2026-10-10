import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { EditorShell } from "./editor-shell";

// Spec: context/feature-specs/05-sidebar-toggle-shortcut.md

// EditorNavbar renders Clerk's UserButton, which needs a ClerkProvider.
vi.mock("@clerk/nextjs", () => ({ UserButton: () => null }));

const CTRL_B = { key: "b", ctrlKey: true };
const META_B = { key: "b", metaKey: true };

function renderShell(children: ReactNode = <p>canvas</p>) {
  const result = render(<EditorShell>{children}</EditorShell>);
  // The navbar toggle and the sidebar's X are both named "Close sidebar" when open,
  // and the open modal hides both from role queries, so find them by id/attribute.
  const toggle = () => {
    const el = result.container.querySelector('[aria-controls="project-sidebar"]');
    if (!el) throw new Error("navbar toggle not found");
    return el;
  };
  const sidebar = () => {
    const el = document.getElementById("project-sidebar");
    if (!el) throw new Error("#project-sidebar not found");
    return el;
  };
  return { ...result, toggle, sidebar };
}

function expectOpen(toggle: Element, sidebar: Element) {
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(sidebar).not.toHaveAttribute("inert");
  expect(sidebar).not.toHaveAttribute("aria-hidden", "true");
}

function expectClosed(toggle: Element, sidebar: Element) {
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(sidebar).toHaveAttribute("inert");
  expect(sidebar).toHaveAttribute("aria-hidden", "true");
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EditorShell sidebar shortcut", () => {
  it("toggles the sidebar open and closed with Ctrl + B (AC4)", () => {
    const { toggle, sidebar } = renderShell();
    expectClosed(toggle(), sidebar());

    fireEvent.keyDown(document.body, CTRL_B);
    expectOpen(toggle(), sidebar());

    fireEvent.keyDown(document.body, CTRL_B);
    expectClosed(toggle(), sidebar());
  });

  it("toggles the sidebar open and closed with Meta + B (AC4)", async () => {
    const user = userEvent.setup();
    const { toggle, sidebar } = renderShell();

    await user.keyboard("{Meta>}b{/Meta}");
    expectOpen(toggle(), sidebar());

    await user.keyboard("{Meta>}b{/Meta}");
    expectClosed(toggle(), sidebar());
  });

  it("stays in sync with the navbar button (AC4)", async () => {
    const user = userEvent.setup();
    const { toggle, sidebar } = renderShell();

    await user.click(toggle());
    expectOpen(toggle(), sidebar());
    fireEvent.keyDown(document.body, META_B);
    expectClosed(toggle(), sidebar());

    fireEvent.keyDown(document.body, CTRL_B);
    expectOpen(toggle(), sidebar());
    await user.click(toggle());
    expectClosed(toggle(), sidebar());
  });

  it("prevents the browser default only on a match (AC5)", () => {
    const { toggle, sidebar } = renderShell();

    expect(fireEvent.keyDown(document.body, CTRL_B)).toBe(false);
    expectOpen(toggle(), sidebar());

    expect(fireEvent.keyDown(document.body, { key: "b" })).toBe(true);
    expect(fireEvent.keyDown(document.body, { ...CTRL_B, shiftKey: true })).toBe(true);
    expect(fireEvent.keyDown(document.body, { ...CTRL_B, altKey: true })).toBe(true);
    expect(fireEvent.keyDown(document.body, { key: "k", ctrlKey: true })).toBe(true);
    expect(fireEvent.keyDown(document.body, { ...CTRL_B, repeat: true })).toBe(true);
    expectOpen(toggle(), sidebar());
  });

  it("ignores the shortcut inside a text field and leaves its default alone (AC3, AC5)", async () => {
    const user = userEvent.setup();
    const { toggle, sidebar } = renderShell(<input aria-label="probe" />);

    const input = screen.getByRole("textbox", { name: "probe" });
    input.focus();
    await user.keyboard("{Control>}b{/Control}");
    expectClosed(toggle(), sidebar());

    expect(fireEvent.keyDown(input, CTRL_B)).toBe(true);
    expectClosed(toggle(), sidebar());
  });

  it("does nothing while the New Project dialog is open (AC6)", async () => {
    const user = userEvent.setup();
    const { toggle, sidebar } = renderShell();

    fireEvent.keyDown(document.body, CTRL_B);
    expectOpen(toggle(), sidebar());

    await user.click(screen.getByRole("button", { name: "New Project" }));
    const dialog = await screen.findByRole("dialog");

    expect(fireEvent.keyDown(document.body, CTRL_B)).toBe(true);
    expect(fireEvent.keyDown(document.activeElement ?? dialog, CTRL_B)).toBe(true);
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(sidebar()).not.toHaveAttribute("aria-hidden", "true");
  });

  it("re-registers cleanly after the dialog closes: one press toggles once (AC6)", async () => {
    const user = userEvent.setup();
    const { toggle, sidebar } = renderShell();

    fireEvent.keyDown(document.body, CTRL_B);
    await user.click(screen.getByRole("button", { name: "New Project" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await vi.waitFor(() => expect(dialog).not.toBeInTheDocument());
    expectOpen(toggle(), sidebar());

    expect(fireEvent.keyDown(document.body, CTRL_B)).toBe(false);
    expectClosed(toggle(), sidebar());
  });

  it("removes the same keydown listener from window on unmount (AC7)", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderShell();
    const added = addSpy.mock.calls.filter(([type]) => type === "keydown").map(([, handler]) => handler);
    expect(added).toHaveLength(1);

    unmount();

    const removed = removeSpy.mock.calls
      .filter(([type]) => type === "keydown")
      .map(([, handler]) => handler);
    expect(removed).toContain(added[0]);
    expect(fireEvent.keyDown(document.body, CTRL_B)).toBe(true);
  });
});

describe("EditorNavbar sidebar toggle (AC8)", () => {
  it("advertises the shortcut and keeps its existing aria attributes", () => {
    const { toggle } = renderShell();

    expect(toggle()).toHaveAttribute("aria-keyshortcuts", "Meta+B Control+B");
    expect(toggle()).toHaveAttribute("aria-label", "Open sidebar");
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).toHaveAttribute("aria-controls", "project-sidebar");
  });
});
