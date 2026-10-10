# Quickstart: Quote of the Day

## Prerequisites

- A current Node.js (for running the dev-only test tooling; not required to serve the page itself).
- No backend, database, or API keys — the page is fully static.

## Run the page

No build step. Either:

- Open `index.html` directly in a browser, **or**
- Serve the repository root with any static file server, e.g.:
  ```sh
  npx serve .
  ```
  then open the printed local URL.

## Run the tests

```sh
npm install        # installs Vitest, Playwright, ESLint (dev dependencies only)
npm run lint        # zero warnings required (Constitution Principle I)
npm test            # Vitest: unit tests (quoteSelector, favoritesStore) + integration tests
npm run test:e2e    # Playwright: end-to-end user-story flows
```

## Manual validation (maps to spec.md acceptance scenarios)

1. **US1 — See a quote on arrival**: Open the page with a fresh profile (or clear site data first). Confirm a quote's text and author are visible immediately, with no click required.
2. **US2 — Get a new random quote**: Click "New quote" several times. Confirm the quote changes each time, and never repeats the immediately-previous one (unless the bundled list is edited down to a single quote, in which case it may repeat by design).
3. **US3 — Favorite the current quote**: Favorite the displayed quote; confirm the indicator updates immediately. Reload the page (or restart the browser), click "New quote" until the same quote reappears, and confirm it still shows as favorited. Un-favorite it and reload again to confirm the removal also persisted.
4. **US4 — Browse favorites**: Favorite two or more quotes, open the favorites view, and confirm all of them appear with text + author. Un-favorite one from that view and confirm it disappears immediately and stays gone after a reload. Then remove all favorites and confirm the view shows a clear empty state instead of an empty/broken list.
5. **Edge case — storage unavailable**: Open the page in a private/incognito window with storage blocked (or use browser devtools to simulate `localStorage` throwing). Confirm quote viewing and "New quote" still work with no visible error; favoriting may simply not persist across reload in this mode.

## Reference

- Module contracts and the `localStorage` schema: [`contracts/js-module-contracts.md`](./contracts/js-module-contracts.md), [`contracts/storage-schema.md`](./contracts/storage-schema.md)
- Entity/field details: [`data-model.md`](./data-model.md)
