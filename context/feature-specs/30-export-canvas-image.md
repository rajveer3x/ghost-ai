Add functionality to export the current architecture canvas as a PNG image, allowing users to easily share their designs outside the application.

### Implementation

1. Add Dependency
- Install `html-to-image` to handle converting the React Flow DOM elements to an image data URL.

2. Export Action
- Add a new "Export Image" button to the existing floating canvas control bar.
- Use the `Camera` or `Download` icon from `lucide-react`.

3. Image Generation Logic
- Use `useReactFlow` (if needed) and `toPng` from `html-to-image` to capture the `.react-flow__viewport` DOM element.
- Ensure the background color (`--bg-base` or `#080809`) is explicitly set in the `toPng` config, as the dark theme canvas might otherwise export with a transparent background.
- Filter out UI controls (like the React Flow minimap or floating control bars) from the screenshot using the `filter` option in `html-to-image` if they are inside the capture container.

4. File Download
- Create a temporary `<a>` element in memory.
- Set its `href` to the generated data URL.
- Set its `download` attribute to `architecture.png`.
- Programmatically click the anchor to trigger the browser download.

### UI Details

- The export button should live alongside the zoom and undo/redo controls on the canvas.
- Follow the existing shadcn/ui button styles (e.g., `variant="secondary"` or `size="icon"`).
- Consider adding a toast notification or changing the icon temporarily to indicate success.

### Scope Limits

- Do not implement backend persistence for the exported image. This is purely a client-side download.
- Do not redesign the canvas controls, just append the new button to the existing control group.
- Only PNG export is required for this step.

### Check When Done

- `html-to-image` is installed in `package.json`.
- Clicking the export button successfully triggers a browser file download.
- The downloaded PNG accurately reflects the canvas layout and styling (including dark mode background).

