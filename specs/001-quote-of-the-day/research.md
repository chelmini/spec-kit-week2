# Research: Quote of the Day

No open `NEEDS CLARIFICATION` markers remain in the spec (see spec.md Assumptions section, which already resolves the ambiguities a visitor-facing description like this tends to raise). The decisions below are the technology/approach choices needed to turn the Technical Context into an implementable plan, made in service of the user's explicit instruction: plain HTML/CSS/JavaScript, no backend, favorites persisted via `localStorage`.

## Decision: No runtime framework or bundler

- **Decision**: Ship `index.html` + plain CSS + vanilla JavaScript, loaded directly by the browser via ordinary `<script src="...">` tags (no `type="module"`). No React/Vue/etc., no webpack/vite build step for production.
- **Rationale**: Explicitly requested by the user. The feature's scope (one page, one list, one toggle, one list view) has no complexity that a framework would pay for itself on — matches Constitution Principle IV (YAGNI, simplest design satisfying stated requirements).
- **Alternatives considered**: A lightweight framework (e.g., Preact) was considered for state management ergonomics, but rejected — state here is a single displayed quote + a favorites set, which vanilla JS handles with a few functions and no reactivity system.

## Decision: No ES modules — classic scripts with a shared global namespace

- **Decision**: None of the shipped JS files use `import`/`export` or `<script type="module">`. Each script file (`quotes.js`, `quoteSelector.js`, `favoritesStore.js`, `app.js`) wraps its code in an IIFE and attaches its public API to a single shared namespace object, `window.QOTD` (e.g., `window.QOTD.quoteSelector = { pickNext }`). `index.html` loads them via plain `<script src="js/quotes.js"></script>` tags, in dependency order, with no `defer`/`type` attributes that would change loading semantics.
- **Rationale**: The user explicitly requires `index.html` to work when opened directly via `file://`. Chromium-based browsers (and Safari, for cross-origin cases) enforce CORS on `<script type="module">` and its `import` statements, and a `file://` document's module imports are treated as cross-origin and blocked — the page would show a quote only when served over HTTP(S), not when double-clicked from disk. Classic `<script src>` tags have no such restriction under `file://`. For testability under Vitest (which runs in Node and understands ESM/CJS, not ad-hoc globals), each script also assigns its API to `module.exports` when `typeof module !== "undefined"` is true, so the exact same unmodified file is `require`-able in tests and globally-attached in the browser, with no build step and no duplication of logic.
- **Alternatives considered**: ES modules with a build step (bundle to a single non-module script for production) — rejected, adds a build/bundler dependency the user explicitly asked to avoid (Constitution Principle IV, YAGNI) for no behavioral benefit at this scale. Inline all JS into one `<script>` block in `index.html` with no separate files — rejected, defeats independent unit-testability of `quoteSelector.js`/`favoritesStore.js` and Principle I's single-responsibility guidance. CommonJS-only files loaded via `require` in the browser — not applicable, browsers have no native `require`.

## Decision: Vitest + jsdom for unit/integration tests, Playwright for e2e

- **Decision**: Use Vitest with a jsdom environment for unit tests of pure logic (`quoteSelector.js`, `favoritesStore.js`) and for integration tests that check `app.js` renders correctly given store/selector state. Use Playwright for end-to-end tests that drive a real browser through each user story's acceptance scenarios, including loading `index.html` via a `file://` URL (not just a served one) to directly verify the no-ES-modules requirement holds in practice.
- **Rationale**: Constitution Principles II and III require tests written before implementation and coverage across unit/integration/e2e levels for every user-facing behavior. A "no backend" static page still needs a dev-time test runner; these are dev dependencies only and do not add anything to the shipped page.
- **Alternatives considered**: Jest (works, but Vitest has lower config overhead and faster watch mode); manual QA only (rejected — violates Principle II's non-negotiable test-first requirement, and the spec's acceptance scenarios are directly expressible as automated tests).

## Decision: Favorites persistence via a thin `localStorage` wrapper with availability detection

- **Decision**: `favoritesStore.js` exposes `getFavorites()`, `isFavorite(id)`, `addFavorite(id)`, `removeFavorite(id)` on the shared `window.QOTD.favoritesStore` namespace (see "No ES modules" decision above). Internally it stores a JSON array of favorited quote IDs under a single key (see data-model.md). Every read/write is wrapped in try/catch; if `localStorage` throws or is unavailable, the store falls back to an in-memory `Map` for the session so the rest of the app (display, favorite toggle, favorites view) keeps working without errors, per the spec's Edge Cases section (FR-008, degrade-gracefully requirement).
- **Rationale**: Isolates all persistence concerns (and all failure handling) behind one script so `app.js` never has to know whether storage is actually durable this session — it just calls the store's API.
- **Alternatives considered**: `sessionStorage` (rejected — does not survive browser restart, violating FR-008/SC-003); IndexedDB (rejected — unnecessary complexity for a small JSON array, violates Principle IV).

## Decision: No-repeat random selection algorithm

- **Decision**: `quoteSelector.js` exposes `pickNext(quotes, previousId)` on `window.QOTD.quoteSelector`, which picks a uniformly random quote from `quotes`, re-rolling if the result equals `previousId` and `quotes.length > 1`; if `quotes.length === 1` it returns that single quote immediately (satisfying FR-004 and its single-quote edge case).
- **Rationale**: Keeps the "don't repeat immediately" rule as a single pure, independently unit-testable function with no DOM or storage dependency.
- **Alternatives considered**: Shuffling the full list and walking through it in order (rejected — more state to track across clicks for no behavioral benefit over simple re-roll, and re-roll is simpler to reason about/test for the single-quote edge case).
