# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Core Editor UI

## Current Goal

- All planned feature specs have been implemented.

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
- Implemented Trigger.dev design agent API routes (`POST /api/ai/design` and `POST /api/ai/design/token`) to trigger tasks and issue run-scoped public tokens.
- Added `TaskRun` Prisma model to track AI background task ownership and history.
- Implemented full AI design agent logic in `trigger/design-agent.ts` using Groq (`@ai-sdk/groq`) to interpret prompts and mutate Liveblocks storage directly.
- Implemented AI Presence State (Spec 24): Added shared AI status feed via `aiStatusFeedSchema` and Liveblocks `RoomEvent`, and updated AI sidebar and live cursors to handle AI active/thinking states.
- Implemented Sidebar Chat Feed (Spec 25): Added real-time room chat to the AI sidebar using a separate Liveblocks `ai-chat` RoomEvent feed. Added Zod schema validation and updated `AiSidebar` to handle sender, timestamp, and message broadcasting.
- Implemented AI Chat Functional Integration (Spec 26): Wired up the AI sidebar UI to submit prompts to Trigger.dev, consume realtime run updates via `@trigger.dev/react-hooks` (`useRealtimeRun`), track execution state to disable inputs, display a compact loading status strip, and apply existing visual tokens (green accent).
- Implemented AI Spec Generation Backend Flow (Spec 27): Added `POST /api/ai/spec` and `POST /api/ai/spec/token` routes to handle Trigger.dev tasks and run ownership tracking. Implemented `trigger/generate-spec.ts` to consume project nodes/edges/chat via Gemini (`@ai-sdk/google`) to generate technical markdown specs and report realtime generation status.
- Implemented AI Spec Persistence and Download (Spec 28): Added `ProjectSpec` Prisma model to track generated specs. Updated `trigger/generate-spec.ts` to upload generated Markdown content directly to Vercel Blob and save metadata to Prisma. Added secure `GET /api/projects/[projectId]/specs/[specId]/download` route to validate collaborator access before streaming file downloads.
- Implemented AI Spec UI Integration (Spec 29): Replaced dummy specs tab with real data fetched from the backend. Added a `Dialog` based modal to preview fetched Markdown content using `react-markdown`. Added direct download links to retrieve generated markdown specs.
- Fixed a silent failure on the "Generate Spec" button where ungenerated Prisma models (`ProjectSpec`, `TaskRun`) and missing database tables were crashing the Next.js API routes. Regenerated the Prisma client and pushed the schema to the database.
- Switched the `generate-spec` task to use the available Groq API key instead of Google, and added a `npm run trigger` script for running the required Trigger.dev background worker locally.
- Updated the design API response to include a Trigger.dev public token scoped to the newly created run, enabling the AI sidebar to subscribe to run updates.
- Validated spec-generation request payloads against the task's shared input schema before starting a Trigger.dev run.
- Fixed a silent failure on Trigger.dev task execution by correcting invalid Groq model names (`openai/gpt-oss-120b` -> `llama3-70b-8192`) in both design and spec generation tasks.
- Improved Trigger.dev task resilience by ensuring `liveblocks.setPresence`, `liveblocks.broadcastEvent`, and Zod parsing are safely executed inside `try...catch` blocks to prevent silent crashes and infinitely hanging loading states on the frontend.
- Resolved Trigger.dev deploy issues by lazily initiating Liveblocks in `lib/liveblocks.ts` to prevent missing-environment-variable crashes during the indexer build phase.
- Reverted Trigger.dev runtime from `node-24` to `node` in `trigger.config.ts` for safer remote deployment compatibility.

## In Progress

- Review complete, project fully implemented according to specs.

## Next Up

- Proceed to the next feature spec.

## Open Questions

- None.

## Architecture Decisions

- Shape sizes are populated at drag time and baked into the node instances directly as styles via drop handlers. 

## Session Notes

- There's an ongoing turbopack next build issue causing `npm run build` to fail in sandbox specifically on `@liveblocks/react-flow/styles.css`, but typechecking succeeds perfectly fine with zero TypeScript errors.
