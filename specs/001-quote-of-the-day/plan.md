# Implementation Plan: Quote of the Day

**Branch**: `001-quote-of-the-day` | **Date**: 2026-10-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-quote-of-the-day/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single static page shows one randomly selected quote (text + author) from a bundled list of 20+ quotes on load, lets the visitor fetch another random quote (never repeating the immediately-prior one unless the list has only one entry), lets the visitor favorite/un-favorite the displayed quote, and lets the visitor browse all favorited quotes. Per explicit user direction, this is built as plain HTML/CSS/JavaScript with no backend or runtime framework; favorites persist via the browser's `localStorage`, degrading gracefully (feature still works, just without persistence) when storage is unavailable. The page MUST also work when `index.html` is opened directly from disk (`file://`), which rules out ES modules (`<script type="module">`, `import`/`export`) since browsers block cross-file module loading under the `file://` origin — script files are loaded as classic `<script>` tags instead.

## Technical Context

**Language/Version**: HTML5, CSS3, vanilla JavaScript (ES2020+ syntax). No ES modules (`import`/`export`, `<script type="module">`) anywhere in shipped code — classic `<script>` tags only, loaded in dependency order, with each script attaching its public API to a shared global namespace object. No transpilation or bundling step required for runtime code.

**Primary Dependencies**: None at runtime (no framework, no bundler required to ship). Dev-only tooling: Vitest (unit/integration tests against pure logic in a jsdom environment) and Playwright (end-to-end browser tests). ESLint for static analysis. Since shipped code has no `export`, each script uses a small dual-registration pattern (attach to `module.exports` when present for Vitest's Node environment, else attach to the browser global) so the same unmodified file is both file://-safe in the browser and directly testable from Vitest with no build step.

**Storage**: Browser `localStorage` only, for the favorites set. No server-side storage; the quote list itself is a static JS data file bundled with the page (no database, no runtime fetch).

**Testing**: Vitest (+ jsdom) for unit/integration tests of pure logic and DOM-rendering scripts; Playwright for end-to-end tests covering each user story's acceptance scenarios, including opening `index.html` via a `file://` URL.

**Target Platform**: Static page served from any static host, or opened directly as a local file via `file://` (explicit requirement — not just "should work served"); modern evergreen browsers (Chrome, Firefox, Safari, Edge, current + previous major version).

**Project Type**: Single static web app (frontend-only; no frontend/backend split).

**Performance Goals**: Initial quote visible within 1s of page load (SC-001); "New quote" swaps content within 1s of click (SC-002). Both are trivially met since quote data is in-memory with no network round-trip.

**Constraints**: No runtime network calls (quotes are bundled, not fetched); must remain fully functional for viewing/requesting quotes when `localStorage` is blocked or throws (e.g., private browsing) — only persistence of favorites degrades, per spec Edge Cases. No ES modules anywhere in shipped code, so that opening `index.html` directly via `file://` works identically to serving it over HTTP (ES module `<script>` tags are blocked by CORS under `file://` in Chromium-based browsers).

**Scale/Scope**: One page, one bundled list of ≥20 quotes, single anonymous visitor per browser/device, no accounts, no cross-device sync, no upper bound on favorites count.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|---|---|---|
| I. Code Quality & Readability | Vanilla JS split into small single-responsibility script files (quote data, random selection, storage, rendering), each with one clear namespace entry, despite not using ES module syntax; ESLint run with zero warnings before merge; no dead code/commented blocks. | PASS |
| II. Test-First Development | Vitest unit tests for selection/storage logic and Playwright e2e tests for each acceptance scenario will be written before the corresponding implementation code, per the red-green-refactor cycle. | PASS |
| III. Comprehensive Test Coverage | Unit tests cover pure logic + documented edge cases (no-repeat selection, single-quote list, storage-unavailable fallback, rapid toggle). Integration tests cover storage↔rendering boundary. E2E tests cover all four user stories end-to-end. | PASS |
| IV. Maintainability & Simplicity | No framework/build tool introduced beyond what's needed to ship a static page; matches explicit user instruction and YAGNI — simplest design satisfying stated requirements. | PASS |
| V. Documentation & Review | Design decisions (storage schema, no-repeat algorithm, fallback behavior) recorded in research.md/data-model.md; PR description will summarize what/why for reviewers. | PASS |

No violations identified. Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-quote-of-the-day/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html                  # Single page: quote display, New quote button,
                             # favorite toggle, favorites view (modal/section)
css/
└── styles.css               # All page styling

js/
├── quotes.js                # Bundled quote data (id, text, author) — ≥20 entries
├── quoteSelector.js          # Pure logic: pick a random quote, avoid immediate repeat
├── favoritesStore.js         # localStorage read/write wrapper + availability fallback
└── app.js                    # Wires DOM events to the above modules; renders state

tests/
├── unit/
│   ├── quoteSelector.test.js
│   └── favoritesStore.test.js
├── integration/
│   └── app.render.test.js    # jsdom: rendering reacts correctly to store/selector state
└── e2e/
    └── quote-of-the-day.spec.js  # Playwright: one spec per user story's scenarios
```

**Structure Decision**: Flat static-site layout at the repository root (`index.html`, `css/`, `js/`) since this is a single page with no server component — the "single project" template option, adapted for a frontend-only static app rather than a CLI/library layout. Logic is split into small, independently-testable vanilla JS script files (data, selection, storage, rendering) so unit tests can exercise pure logic (`quoteSelector.js`, `favoritesStore.js`) without a DOM, while `app.js` stays a thin wiring layer covered by integration/e2e tests. Because ES modules are off the table (file:// compatibility), `index.html` loads each script with an ordinary `<script src="...">` tag, in dependency order (`quotes.js` → `quoteSelector.js` → `favoritesStore.js` → `app.js`), and each file attaches its public API to a shared `window.QOTD` namespace object rather than using `import`/`export`.

## Complexity Tracking

Not applicable — no Constitution Check violations.
