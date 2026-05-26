# AGENTS

Purpose: onboarding notes for coding agents working in this repo.
Scope: commands, conventions, and coding style.

## Project snapshot
- Stack: Vite + React (JSX), Leaflet, Tailwind CSS (imported in CSS)
- Entry: src/main.jsx
- App root: src/App.jsx
- Data: src/data/timeline.js, src/data/points.js
- Styles: src/index.css

## Repo structure
- src/main.jsx: React entry and global CSS imports
- src/App.jsx: main UI layout and map composition
- src/data/timeline.js: timeline entries for map layers
- src/data/points.js: POI metadata and color tokens
- src/index.css: global styles, layout, and Leaflet overrides

## Setup
- Install deps: `npm install`
- Node: use a recent LTS (Vite 5+).
- Package manager: npm (package-lock.json is present).

## Dev/build/lint/test
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`

### Tests
- No test runner configured in this repo.
- There is no single-test command; add a test framework if needed.
- If you add Vitest, document commands like:
  - All tests: `npm run test`
  - Single test file: `npm run test -- path/to/test`
  - Single test name: `npm run test -- -t "test name"`

## Deployment notes
- Cloudflare Wrangler expects Vite >= 6.0.0 for auto configuration.
- Output directory: `dist` (from Vite build).
- If Wrangler fails, verify `npm run build` succeeds locally first.

## Cursor/Copilot rules
- No Cursor rules found (.cursor/rules/ or .cursorrules).
- No Copilot rules found (.github/copilot-instructions.md).

## Code style guidelines

### General
- Use ESM imports/exports.
- Keep files small and focused; place static data in `src/data/*`.
- Prefer `const` and immutable data structures.
- Use explicit names over abbreviations.
- Prefer early returns for guard clauses.
- Avoid hidden side effects in render; compute derived values before return.

### Imports
- Group imports by source:
  1) external libs
  2) local modules
- Keep imports sorted by module type; avoid deep relative paths if a local alias is added later.
- Prefer named imports; avoid default imports unless the module exposes one.
- Avoid importing CSS outside entry points unless required by a component library.

### Formatting
- Use the existing formatting style in the file.
- JSX:
  - Wrap long props per line and align with current style.
  - Prefer inline ternaries for simple conditions; extract for complex logic.
- Keep trailing commas where already used.
- Keep JSX blocks compact; avoid unnecessary fragments.

### Naming
- Components: PascalCase (e.g., `MapPanel`).
- Variables/functions: camelCase (e.g., `overlayLoading`).
- Constants: camelCase or SCREAMING_SNAKE only if already used in file.
- Data objects: consistent keys and types across items.
- CSS classes: kebab-case with semantic names.

### React patterns
- Functional components only.
- Use hooks at top level; no conditional hooks.
- Use `useMemo` for derived values when referenced multiple times.
- Keep side effects in `useEffect`; avoid effect dependencies that can be derived inline.
- Keep map effects isolated to map-related hooks (see `DisableZoom`).
- Avoid creating new handler objects in render when not needed.

### Data modules
- `src/data/timeline.js`:
  - Each item should keep the same shape: `id`, `year`, `title`, `summary`, `layerId`.
  - `id` should remain unique and string-based.
- `year` stays string to preserve formatting.
- `src/data/points.js`:
  - `mapCenter` is a `[lat, lng]` tuple.
  - Each POI keeps `id`, `name`, `description`, `position`, `color`.
  - `color` must exist in `colorMap`.
- Keep POI positions in decimal degrees.

### Styling
- Global styles live in `src/index.css`.
- Tailwind is imported, but styles are authored as standard CSS classes.
- Use CSS variables in `:root` for colors, elevation, motion, and shapes.
- Prefer class-based styling and avoid inline styles unless dynamic.
- Maintain responsive rules in the existing mobile breakpoint (`@media (max-width: 960px)`).
- Reuse existing tokens for color and motion rather than introducing new literals.
- Keep Leaflet overrides near the bottom of the file for visibility.

### Error handling and safety
- Guard against null data (see `active` in `src/App.jsx`).
- Keep UI resilient when remote tiles fail; use the existing loading state pattern.
- Do not assume network availability for WMTS tiles.
- Avoid throwing inside render; show a fallback label instead.

### Accessibility
- Provide clear button labels and visible focus where relevant.
- Avoid disabling controls without alternative access.
- Preserve readable contrast for overlay text and controls.

### Leaflet usage
- Keep map options stable; avoid re-creating layers unnecessarily.
- Use `key` when swapping WMTS layers to force tile refresh.
- Use `crossOrigin` for WMTS tiles to avoid canvas taint issues.
- Avoid enabling interactions that conflict with the fixed-layout design.

### Type safety
- JavaScript only; no TypeScript config present.
- If adding types via JSDoc, keep them minimal and local to complex helpers.

## Workflow tips
- If you add a test framework, document it here and include a single-test command.
- When updating data files, verify map layers and labels render correctly.
- Check `npm run lint` before pushing changes.
- Keep README notes in sync when adding new scripts or data sources.
