# Ghost AI

## Overview

Ghost AI is a real-time Collaborative system design workspace. Users describe a system in pain English, an AI agent maps
that system onto a shared canvas, collaborators refine the architecture, and AI app generates a technical specification from
the resulting architecture or graph.

## Goals

1. Let authenticated users create and manage system design projects.
2. Enable real-time collaboration on system design projects.
3. Automatically generate technical specifications from the refined architecture.
4. Let users import prebuilt starter system design templates into the canvas.
5. Let AI generate an initial system architecture from a textual description (natural language prompt).
6. Let Contributors collaboratively refine the generated system architecture on the shared canvas.
7. Convert the final refined architecture into a presistent Markdown technical specification.

## Core User Flow

1. User signs in
2. User creates or opens a system design project.
3. User enters the project workspace.
4. User optionally imports a prebuilt starter system design template into the canvas.
5. User describes the system in plain English.
6. AI agent generates an initial system architecture on the shared canvas.
7. Collaborators refine or edit the architecture on the shared canvas.
8. User triggers the AI app to generate a technical specification Markdown from the refined architecture.
9. AI app generates the technical specification in Markdown format.
10. User reviews the generated technical specification in Markdown format.

## Features

### Authentication and Projects

- Users can sign in, sign out, and route protection for authenticated pages.
- Project creation, management, ownership, collaboration, and access control for authenticated users.
- Project list and workspace navigation.

### Collaborative Canvas

- Real-time collaborative canvas for system design using Liveblocks and React Flow.
- Live cursors, presence indicators, and real-time updates for all collaborators.
- Users can add, edit, and delete components on the canvas.
- AI agent can generate an initial system architecture on the canvas.
- Changes are synchronized in real-time among all collaborators.
- Canvas snapshots persisted to the filesystem for version history and recovery.

### Starter System Design Templates

- Users can import prebuilt starter system design templates into the canvas.
- Templates provide a starting point for system architecture and can be customized by collaborators.
- A curated library of prebuilt starter system design templates is available for users to choose from.
- Templates are static canvas snapshots that serve as a starting point for system design and loaded directly onto the canvas.
- Covers common system design patterns and best practices for users to follow when customizing templates: monolithic architecture, microservices, event-driven architecture, and serverless architecture.

### AI Architecture Generation

- AI agent can generate an initial system architecture on the canvas based on user input.
- Users can refine and edit the AI-generated architecture collaboratively.
- AI app can generate a technical specification in Markdown format from the refined architecture.
- AI-generated content is synchronized in real-time and can be reviewed and modified by all collaborators.
- Users can provide feedback to the AI agent to improve future architecture generation.

### Technical Specification Generation

- AI app generates a technical specification in Markdown format from the refined architecture.
- Users can review, edit, and approve the generated technical specification.
- Technical specifications are versioned and stored alongside the project for future reference.

## Scope

### In Scope

- Users can sign in, create, and manage system design projects.
- Users can collaborate in real-time on a shared system design canvas.
- Users can import and customize starter system design templates.
- AI agent can generate initial system architecture and technical specifications.
- Users can review, edit, and approve AI-generated technical specifications.

### Out of Scope

- Users cannot collaborate on the canvas without signing in.
- AI agent cannot make changes without user input.
- Templates cannot be modified outside the canvas environment.

## Success Criteria

1. A signed-in user can create and open a project.
2. Users can collaborate in real-time on a shared system design canvas.
3. Users can import and customize starter system design templates.
4. AI agent can generate initial system architecture and technical specifications.
5. Users can review, edit, and approve AI-generated technical specifications.
