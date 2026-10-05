# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Core Editor UI

## Current Goal

- Implement custom node types and drag-and-drop shape panel for the collaborative canvas.

## Completed

- Set up React Flow wrapper inside collaborative canvas.
- Added a draggable shape panel component with various node types (rectangle, diamond, circle, pill, cylinder, hexagon).
- Configured drag-and-drop mechanics to create nodes natively on the canvas using React Flow `useReactFlow` API to calculate precise canvas coordinates based on viewport.
- Configured `CanvasNode` custom type.

## In Progress

- Next set of feature specs.

## Next Up

- Render specific visual appearances for all the different shape types.

## Open Questions

- None.

## Architecture Decisions

- Shape sizes are populated at drag time and baked into the node instances directly as styles via drop handlers. 

## Session Notes

- There's an ongoing turbopack next build issue causing `npm run build` to fail in sandbox specifically on `@liveblocks/react-flow/styles.css`, but typechecking succeeds perfectly fine with zero TypeScript errors.
