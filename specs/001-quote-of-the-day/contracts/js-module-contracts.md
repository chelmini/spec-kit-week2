# Contracts: JS Module Interfaces

This app has no external/network API. Its "contracts" are the internal module boundaries that tests (unit, integration, e2e) and `app.js` rely on. Each function signature below is a contract: implementation MAY change internally, but inputs/outputs/error behavior MUST NOT, without updating this file and the dependent tests.

## `js/quotes.js`

```js
export const quotes = [
  { id: "q01", text: "...", author: "..." },
  // ...at least 20 entries (FR-012)
];
```

- MUST export a frozen or otherwise non-mutated array named `quotes`.
- MUST contain ≥20 entries; every entry has non-empty `id`, `text`, `author`; all `id`s unique (data-model.md validation rules).

## `js/quoteSelector.js`

```js
/**
 * @param {Array<{id: string}>} quotes - non-empty list to pick from
 * @param {string|null} previousId - id to avoid repeating, or null if none yet
 * @returns {{id: string, text: string, author: string}} the chosen quote
 */
export function pickNext(quotes, previousId) { /* ... */ }
```

- MUST throw if `quotes` is empty (precondition — the bundled list is never empty; callers must not call this with an empty array).
- MUST NOT return a quote whose `id === previousId` when `quotes.length > 1`.
- MUST return the single available quote when `quotes.length === 1`, even if its `id === previousId` (FR-004's documented exception).
- MUST be pure: no DOM access, no storage access, no side effects.

## `js/favoritesStore.js`

```js
/** @returns {string[]} current favorited quote ids, best-effort (empty array if storage unavailable/empty) */
export function getFavorites() { /* ... */ }

/** @param {string} id @returns {boolean} */
export function isFavorite(id) { /* ... */ }

/** @param {string} id - idempotent: no-op if already favorited */
export function addFavorite(id) { /* ... */ }

/** @param {string} id - idempotent: no-op if not currently favorited */
export function removeFavorite(id) { /* ... */ }
```

- MUST persist to `localStorage` under key `qotd:favorites` as a JSON array of ids (data-model.md) whenever `localStorage` is available and writable.
- MUST NOT throw to the caller under any circumstance, including `localStorage` being disabled, full, or throwing a `SecurityError` (private browsing) — on any such failure, MUST fall back to an in-memory-only store for the remainder of the page session and continue to satisfy every method above from that in-memory state.
- MUST return a new array from `getFavorites()` each call (no external mutation of internal state through the returned reference).

## `js/app.js`

Not a reusable library contract — this is the DOM wiring layer. Its observable contract (verified by integration/e2e tests, not by other modules importing it) is the rendered-DOM behavior:

- On load: renders exactly one quote (text + author) from `quotes` via `pickNext(quotes, null)`, and reflects its favorite state via `isFavorite(quote.id)` (FR-001, FR-002, FR-007).
- On "New quote" activation: re-renders using `pickNext(quotes, currentQuote.id)` (FR-003).
- On favorite-toggle activation: calls `addFavorite`/`removeFavorite` appropriately and immediately updates the visible indicator (FR-005, FR-006, FR-007).
- On favorites-view activation: renders every id from `getFavorites()` resolved against `quotes`, or an explicit empty-state message when `getFavorites()` is empty (FR-009, FR-010).
