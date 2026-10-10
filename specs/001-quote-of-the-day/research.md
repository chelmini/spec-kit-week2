# Research: Quote of the Day

No open `NEEDS CLARIFICATION` markers remain in the spec (see spec.md Assumptions section, which already resolves the ambiguities a visitor-facing description like this tends to raise). The decisions below are the technology/approach choices needed to turn the Technical Context into an implementable plan, made in service of the user's explicit instruction: plain HTML/CSS/JavaScript, no backend, favorites persisted via `localStorage`.

## Decision: No runtime framework or bundler

- **Decision**: Ship `index.html` + plain CSS + vanilla ES module JavaScript, loaded directly by the browser via `<script type="module">`. No React/Vue/etc., no webpack/vite build step for production.
- **Rationale**: Explicitly requested by the user. The feature's scope (one page, one list, one toggle, one list view) has no complexity that a framework would pay for itself on — matches Constitution Principle IV (YAGNI, simplest design satisfying stated requirements).
- **Alternatives considered**: A lightweight framework (e.g., Preact) was considered for state management ergonomics, but rejected — state here is a single displayed quote + a favorites set, which vanilla JS handles with a few functions and no reactivity system.

## Decision: Vitest + jsdom for unit/integration tests, Playwright for e2e

- **Decision**: Use Vitest with a jsdom environment for unit tests of pure logic (`quoteSelector.js`, `favoritesStore.js`) and for integration tests that check `app.js` renders correctly given store/selector state. Use Playwright for end-to-end tests that drive a real browser through each user story's acceptance scenarios.
- **Rationale**: Constitution Principles II and III require tests written before implementation and coverage across unit/integration/e2e levels for every user-facing behavior. A "no backend" static page still needs a dev-time test runner; these are dev dependencies only and do not add anything to the shipped page.
- **Alternatives considered**: Jest (works, but Vitest has lower config overhead for ESM-only vanilla JS and faster watch mode); manual QA only (rejected — violates Principle II's non-negotiable test-first requirement, and the spec's acceptance scenarios are directly expressible as automated tests).

## Decision: Favorites persistence via a thin `localStorage` wrapper with availability detection

- **Decision**: `favoritesStore.js` exposes `getFavorites()`, `isFavorite(id)`, `addFavorite(id)`, `removeFavorite(id)`. Internally it stores a JSON array of favorited quote IDs under a single key (see data-model.md). Every read/write is wrapped in try/catch; if `localStorage` throws or is unavailable, the store falls back to an in-memory `Map` for the session so the rest of the app (display, favorite toggle, favorites view) keeps working without errors, per the spec's Edge Cases section (FR-008, degrade-gracefully requirement).
- **Rationale**: Isolates all persistence concerns (and all failure handling) behind one module so `app.js` never has to know whether storage is actually durable this session — it just calls the store's API.
- **Alternatives considered**: `sessionStorage` (rejected — does not survive browser restart, violating FR-008/SC-003); IndexedDB (rejected — unnecessary complexity for a small JSON array, violates Principle IV).

## Decision: No-repeat random selection algorithm

- **Decision**: `quoteSelector.js` exposes `pickNext(quotes, previousId)`, which picks a uniformly random quote from `quotes`, re-rolling if the result equals `previousId` and `quotes.length > 1`; if `quotes.length === 1` it returns that single quote immediately (satisfying FR-004 and its single-quote edge case).
- **Rationale**: Keeps the "don't repeat immediately" rule as a single pure, independently unit-testable function with no DOM or storage dependency.
- **Alternatives considered**: Shuffling the full list and walking through it in order (rejected — more state to track across clicks for no behavioral benefit over simple re-roll, and re-roll is simpler to reason about/test for the single-quote edge case).
