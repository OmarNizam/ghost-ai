import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import NotFound from "./not-found";

// Spec: context/feature-specs/04-dark-not-found-page.md
describe("NotFound (app/not-found.tsx)", () => {
  it("is a synchronous component that renders without props (AC1)", () => {
    expect(NotFound()).not.toBeInstanceOf(Promise);
    expect(() => render(<NotFound />)).not.toThrow();
  });

  it("shows a 'Page not found' heading with a 404 label (AC2)", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("tells the user the page does not exist or has moved (AC2)", () => {
    render(<NotFound />);

    expect(screen.getByText("This page does not exist or has moved.")).toBeInTheDocument();
  });

  it("offers exactly one action, a 'Back to editor' link to /editor (AC3)", () => {
    render(<NotFound />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName("Back to editor");
    expect(links[0]).toHaveAttribute("href", "/editor");
  });

  it("has no buttons, so the link is the only primary action (AC3)", () => {
    render(<NotFound />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("puts exactly one h1 inside the main landmark (AC7)", () => {
    render(<NotFound />);

    const main = screen.getByRole("main");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(within(main).getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("reaches the link with the first Tab press (AC7)", async () => {
    const user = userEvent.setup();
    render(<NotFound />);

    await user.tab();

    expect(screen.getByRole("link", { name: "Back to editor" })).toHaveFocus();
  });

  it("hides the decorative ghost icon from screen readers (AC6)", () => {
    const { container } = render(<NotFound />);

    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((icon) => expect(icon).toHaveAttribute("aria-hidden", "true"));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
