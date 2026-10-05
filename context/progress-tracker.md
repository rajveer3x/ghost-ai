# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Core Editor UI

## Current Goal

- Implement Canvas autosave to Vercel Blob and Prisma.

## Completed

- Set up React Flow wrapper inside collaborative canvas.
- Added a draggable shape panel component with various node types (rectangle, diamond, circle, pill, cylinder, hexagon).
- Configured drag-and-drop mechanics to create nodes natively on the canvas using React Flow `useReactFlow` API to calculate precise canvas coordinates based on viewport.
- Configured `CanvasNode` custom type.
- Rendered specific visual appearances for all the different shape types using CSS and SVG.
- Implemented a native ghost drag preview for the shape panel when dragging elements.
- Added node resizing controls (via `@xyflow/react` NodeResizer) linked to live node state.
- Implemented inline node label editing with auto-resizing textarea that safely avoids canvas dragging/panning during edits.
- Added a floating `NodeToolbar` for selected nodes that allows changing the node's background and text color based on predefined aesthetic dark-mode themes.
- Implemented custom canvas edges with clean right-angle routing, hidden handles that fade on hover, and inline edge label editing.
- Added a floating control bar on the canvas for zoom and history controls.
- Linked zoom controls to React Flow instance and history controls (undo/redo) to Liveblocks history.
- Implemented global keyboard shortcuts for zoom and undo/redo while avoiding input fields.
- Fixed the Template Modal by lifting its state out of the React Flow context and to the top-level EditorWorkspaceClient, resolving an issue where the modal wouldn't open. The modal correctly imports templates via window events without CRDT collisions.
- Implemented presence avatars displaying collaborators inside the editor canvas view using Liveblocks presence and Clerk authentication.
- Added live cursors showing the mouse position of other participants on the canvas using React Flow mouse events and Liveblocks presence.
- Separated the AI sidebar into its own `AiSidebar` component, preserving the existing floating slide-in behavior and styles.
- Built the AI Architect tab with a scrollable chat area, empty state with starter chips, and input UI with auto-resizing textarea.
- Built the Specs tab with a generate button and a static demo spec card.
- Added canvas autosave and loading to persist project state before AI generation. Canvas JSON is stored in Vercel Blob and the URL is stored on the Prisma project record.
- Fixed canvas UI bugs: dynamic Save Button states, custom node/edge deletion via Liveblocks mutators, non-blocking connection handles, preventing auto-zoom on first node drop, allowing Clerk avatars to load properly, and conditionally hiding the UserButton in the workspace navbar.

## In Progress

- Next feature specs review.

## Next Up

- Proceed to the next feature spec.

## Open Questions

- None.

## Architecture Decisions

- Shape sizes are populated at drag time and baked into the node instances directly as styles via drop handlers. 

## Session Notes

- There's an ongoing turbopack next build issue causing `npm run build` to fail in sandbox specifically on `@liveblocks/react-flow/styles.css`, but typechecking succeeds perfectly fine with zero TypeScript errors.
