Read the `AGENTS.md` file before starting.

## Current Phase

- Phase 2: Editor

## Current Goal

- Implement the editor feature as specified in the design and requirements documents.
- We need the base chrome components that frame every editor screen - the top navbar and left sidebar shell.
  These will be reused and extended in every chapter that follows.

### Editor Navbar

Create `components/editor/editor-navbar.tsx`.
The editor navbar will include the following elements:

- fixed-height top navbar
- left, center, and right sections for organizing navbar content.
- left section contains sidebar toggle button.
- center section contains navigation links or buttons.
- use `PanelLeftOpen` / `PanelLeftClose` icons for the sidebar toggle button.
- right section empty for now.
- dark background with subtle bottom border.

### Project Sidebar

Create `components/editor/project-sidebar.tsx`.
The project sidebar will include the following elements:

- sidebar should float above the main content area, allowing it to be collapsible and easily accessible.
- opening it should not push page content
- slides in and out smoothly when toggled
- slides in from the left
- accepts `isOpen` prop.
- header section with `Projects` title + close button.
- shadcn `Tabs`:
  - My Projects
  - Shared Projects
- both tabs show empty placeholder states.
- full-width `New Project` button at the bottom of the sidebar with `Plus` icon.

### Dialog Pattern

- Create `components/editor/dialog.tsx`.
- The dialog will include the following elements:

- modal overlay that covers the entire viewport.
- centered dialog box with a fixed width and height.
- header section with a title and close button.
- content section for displaying dialog content.
- footer section for action buttons (e.g., `Cancel`, `Confirm`).
- accepts `isOpen` prop to control its visibility.
- slides in and out smoothly when toggled.
- should be accessible, including focus trapping and keyboard navigation.

Don't build actual dialog functionality yet; focus on the structure and styling.

### Check when done

- new components compile without TypeScript errors.
- editor navbar displays correctly with left, center, and right sections.
- project sidebar opens and closes smoothly.
- dialog structure is rendered correctly when `isOpen` is true.
- dialog pattern is ready for future use.
- all interactive elements (e.g., sidebar toggle, dialog close button) respond to user actions as expected.
