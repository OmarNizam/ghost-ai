Read the `AGENTS.md` file before staring.

# Design System Feature Specs

We are adding the design sysstem and UI primitive components to the project.

## Goals

- Establish a consistent design language across the application.
- Create reusable UI components to speed up development.
- Ensure accessibility and responsiveness in all components.

## Components

Add these shadcn components to the project:

- **Button**
- **Input**
- **Card**
- **Dialog**
- **Tabs**
- **Textarea**
- **ScrollArea**

## Installation

- install and configure `shadcn/ui` by following the official documentation.
- Verify the installation by importing and using a component in your project.
- Test the components in different screen sizes to ensure responsiveness.
- Review the documentation and examples provided by `shadcn/ui` to understand best practices and usage patterns.
- install `lucide-react` for icon support in the design system.

## Usage Guidelines

- Prefer using the provided components over creating new ones from scratch.
- Follow the design tokens and theming conventions established by the design system.
- Ensure that any custom components adhere to the same accessibility and responsiveness standards.
- Document any new components or extensions for future reference.
- Regularly review and update the design system to incorporate feedback and evolving best practices.
- Dont modify the existing design system components directly; always extend or compose them to maintain consistency.

Don't modify the generated `components/ui/*` files directly; always extend or compose them to maintain consistency.

Create `lib/utils` with a reusable `cn()` helper for merging Tailwind classes safely.

Ensure that the `cn()` helper is used consistently across all components to maintain class merging consistency and avoid conflicts.

Ensure all components match the existing darktheme in `globals.css`.

### Check when done

- All components are responsive and accessible.
- The `cn()` helper is used consistently across all components.
- No existing design system components were modified directly.
- All new components adhere to the established design language and theming conventions.
- The dark theme in `globals.css` is correctly applied to all components.
- No default light styling appears.
