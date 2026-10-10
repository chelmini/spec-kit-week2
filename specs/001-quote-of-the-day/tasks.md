---

description: "Task list template for feature implementation"
---

# Tasks: Quote of the Day

**Input**: Design documents from `/specs/001-quote-of-the-day/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included. Constitution Principle II (Test-First Development, NON-NEGOTIABLE) requires tests written before implementation; quickstart.md and plan.md's Constitution Check both call out Vitest unit/integration tests and Playwright e2e tests per acceptance scenario.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Flat static-site layout at the repository root (per plan.md Structure Decision): `index.html`, `css/styles.css`, `js/*.js`, `tests/unit/`, `tests/integration/`, `tests/e2e/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling

- [ ] T001 Create project directory structure: `index.html`, `css/`, `js/`, `tests/unit/`, `tests/integration/`, `tests/e2e/` at repository root per plan.md Project Structure
- [ ] T002 Initialize npm project (`package.json`) and install dev dependencies: Vitest, jsdom, `@playwright/test`, ESLint (quickstart.md Prerequisites; no runtime dependencies, per research.md "No runtime framework or bundler")
- [ ] T003 [P] Configure ESLint (`.eslintrc`) for vanilla ES2020+ JS with zero-warnings required before merge (Constitution Principle I)
- [ ] T004 [P] Configure Vitest (`vitest.config.js`) with a jsdom environment for `tests/unit/` and `tests/integration/`
- [ ] T005 [P] Configure Playwright (`playwright.config.js`) for `tests/e2e/`, including a way to load `index.html` via a `file://` URL as well as a served URL (quickstart.md Constraint; plan.md `file://` requirement)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and page skeleton that every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 [P] Create `js/quotes.js` registering `QOTD.quotes` via the dual-registration pattern from `contracts/js-module-contracts.md` (IIFE; `module.exports` when `module` exists, else `window.QOTD.quotes`); the list MUST contain "≥20 entries" (FR-012, data-model.md), and "every entry MUST have a non-empty `id`, `text`, and `author`" with "`id` values MUST be unique across the list" (data-model.md validation rules)
- [ ] T007 [P] Unit test for `js/quotes.js` data integrity in `tests/unit/quotes.test.js`: asserts the list has at least 20 entries, every `id`/`text`/`author` is non-empty, and all `id`s are unique (data-model.md validation rules; write this test and confirm it fails before T006 is complete, per Constitution Principle II)
- [ ] T008 Create `index.html` skeleton with a quote-display container (elements for quote text and author) and a `<script src="js/quotes.js">` tag; later phases append the remaining `<script>` tags in the fixed dependency order from research.md (`quotes.js` → `quoteSelector.js` → `favoritesStore.js` → `app.js`) and additional DOM elements as those files are created
- [ ] T009 [P] Create `css/styles.css` with base page layout and typography for the quote display

**Checkpoint**: Foundation ready — quote data loads and the page skeleton exists; user story implementation can now begin.

---

## Phase 3: User Story 1 - See a quote on arrival (Priority: P1) 🎯 MVP

**Goal**: A visitor opens the page and immediately sees a random quote (text + author), no action required.

**Independent Test**: Load the page with no prior state and confirm a quote with text and attribution is visible without any user interaction.

### Tests for User Story 1 ⚠️

> Write these tests FIRST, confirm they FAIL before implementation (Constitution Principle II)

- [ ] T010 [P] [US1] Unit tests for `QOTD.quoteSelector.pickNext` in `tests/unit/quoteSelector.test.js`: `pickNext(quotes, null)` returns one of the given quotes; "MUST throw if `quotes` is empty" (contracts/js-module-contracts.md)
- [ ] T011 [P] [US1] Integration test in `tests/integration/app.render.test.js`: on simulated page load, `app.js` renders exactly one quote's text and author into the DOM (FR-001, FR-002)
- [ ] T012 [P] [US1] E2E test in `tests/e2e/quote-of-the-day.spec.js`: opening `index.html`, both served and via a `file://` URL, displays a quote and author automatically with no interaction (spec.md US1 Acceptance Scenario 1)

### Implementation for User Story 1

- [ ] T013 [US1] Implement `js/quoteSelector.js`: `pickNext(quotes, previousId)` per `contracts/js-module-contracts.md`, registered on `QOTD.quoteSelector` via the dual-registration pattern; throws when `quotes` is empty; "MUST be pure: no DOM access, no storage access, no side effects" (depends on T006)
- [ ] T014 [US1] Implement a `render(quote)` function in `js/app.js` that writes `quote.text` and `quote.author` into the `index.html` quote-display elements, plus an init routine that calls `QOTD.quoteSelector.pickNext(QOTD.quotes, null)` on page load and passes the result to `render()` (depends on T008, T013)
- [ ] T015 [US1] Add `<script src="js/quoteSelector.js">` and `<script src="js/app.js">` tags to `index.html`, after `js/quotes.js` and in that order, per the fixed dependency order (depends on T008, T013, T014)

**Checkpoint**: User Story 1 is fully functional and independently testable — loading the page shows a random quote with no interaction.

---

## Phase 4: User Story 2 - Get a new random quote (Priority: P2)

**Goal**: Clicking "New quote" replaces the displayed quote with another random one, never immediately repeating the prior quote (unless only one quote exists).

**Independent Test**: With a quote already displayed, click "New quote" and confirm the displayed quote changes.

### Tests for User Story 2 ⚠️

- [ ] T016 [P] [US2] Unit test additions in `tests/unit/quoteSelector.test.js`: "MUST NOT return a quote whose `id === previousId` when `quotes.length > 1`"; "MUST return the single available quote when `quotes.length === 1`, even if its `id === previousId`" (FR-004, contracts/js-module-contracts.md)
- [ ] T017 [P] [US2] E2E test addition in `tests/e2e/quote-of-the-day.spec.js`: clicking "New quote" repeatedly changes the displayed quote and never repeats the immediately-previous one when the list has more than one entry, and may repeat when the list has exactly one entry (spec.md US2 Acceptance Scenarios 1–3)

### Implementation for User Story 2

- [ ] T018 [US2] Add a "New quote" button element to the `index.html` quote-display section (depends on T008)
- [ ] T019 [US2] Implement a click handler in `js/app.js` that tracks the currently-displayed quote, calls `QOTD.quoteSelector.pickNext(QOTD.quotes, currentQuote.id)` on "New quote" activation, and re-renders via the `render()` function from T014 (FR-003; depends on T014, T018)

**Checkpoint**: User Stories 1 and 2 both work independently — a quote loads on arrival and "New quote" cycles without immediate repeats.

---

## Phase 5: User Story 3 - Favorite the current quote (Priority: P2)

**Goal**: A visitor can favorite/un-favorite the displayed quote, and that status persists across reloads and browser restarts.

**Independent Test**: Favorite a quote, reload the page (or cycle back to it via "New quote"), and confirm it still shows as favorited; confirm un-favoriting is equally durable.

### Tests for User Story 3 ⚠️

- [ ] T020 [P] [US3] Unit tests for `js/favoritesStore.js` in `tests/unit/favoritesStore.test.js`: "Adding a favorite MUST be idempotent"; "Removing a favorite MUST be idempotent"; "a missing, malformed, or non-array-of-strings localStorage value is treated as an empty set" (data-model.md, contracts/storage-schema.md); `getFavorites()` "MUST return a new array from `getFavorites()` each call"
- [ ] T021 [P] [US3] Unit test addition in `tests/unit/favoritesStore.test.js`: when `localStorage` throws (simulate a `SecurityError`) on any method, the store falls back to an in-memory store for the rest of the session and "MUST NOT throw to the caller under any circumstance" (contracts/js-module-contracts.md)
- [ ] T022 [P] [US3] Integration test addition in `tests/integration/app.render.test.js`: `render()` reflects `QOTD.favoritesStore.isFavorite(quote.id)` as a visible favorited/not-favorited indicator (FR-007)
- [ ] T023 [P] [US3] E2E test addition in `tests/e2e/quote-of-the-day.spec.js`: favoriting the displayed quote updates the indicator immediately and survives a page reload; un-favoriting removes the status just as durably (spec.md US3 Acceptance Scenarios 1–3)

### Implementation for User Story 3

- [ ] T024 [US3] Implement `js/favoritesStore.js` exposing `getFavorites()`, `isFavorite(id)`, `addFavorite(id)`, `removeFavorite(id)` on `QOTD.favoritesStore` via the dual-registration pattern; "MUST persist to `localStorage` under key `qotd:favorites` as a JSON array of ids"; every access wrapped in try/catch, falling back to an in-memory store for the session on any failure (contracts/storage-schema.md, contracts/js-module-contracts.md; depends on T006)
- [ ] T025 [US3] Add a favorite-toggle control and a favorited/not-favorited indicator element to the `index.html` quote-display section, plus a `<script src="js/favoritesStore.js">` tag loaded after `js/quotes.js` and before `js/app.js` (depends on T008, T024)
- [ ] T026 [US3] Update `render()` in `js/app.js` to set the favorite indicator from `QOTD.favoritesStore.isFavorite(quote.id)`, and add a toggle handler that calls `addFavorite`/`removeFavorite` appropriately and immediately updates the indicator (FR-005, FR-006, FR-007; depends on T014, T024, T025)

**Checkpoint**: User Stories 1, 2, and 3 all work independently — favoriting persists across reloads.

---

## Phase 6: User Story 4 - Browse favorited quotes (Priority: P3)

**Goal**: A visitor can view the full list of favorited quotes, with a clear empty state when none exist.

**Independent Test**: Favorite two or more quotes, open the favorites view, and confirm all favorited quotes appear with their text and author.

### Tests for User Story 4 ⚠️

- [ ] T027 [P] [US4] Integration test addition in `tests/integration/app.render.test.js`: the favorites view renders every id from `getFavorites()` resolved against `QOTD.quotes` with text and author, and renders an explicit empty-state message when `getFavorites()` is empty (FR-009, FR-010)
- [ ] T028 [P] [US4] E2E test addition in `tests/e2e/quote-of-the-day.spec.js`: favoriting two or more quotes and opening the favorites view lists all of them; un-favoriting from that view removes the item immediately and the removal persists after reload; removing all favorites shows the empty state (spec.md US4 Acceptance Scenarios 1–3)

### Implementation for User Story 4

- [ ] T029 [US4] Add a favorites-view section (list/modal) and its open/close control to `index.html` (depends on T008)
- [ ] T030 [US4] Implement favorites-view rendering in `js/app.js`: map each id from `QOTD.favoritesStore.getFavorites()` to its entry in `QOTD.quotes` (text + author), or render the empty-state message when the list is empty (FR-009, FR-010; depends on T024, T026, T029)
- [ ] T031 [US4] Implement an un-favorite-from-view handler in `js/app.js` that calls `QOTD.favoritesStore.removeFavorite(id)`, removes that item from the rendered favorites view immediately, and keeps the main quote-display indicator in sync if the removed quote is currently displayed (depends on T030)

**Checkpoint**: All user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality gates across all stories

- [ ] T032 [P] Run `npm run lint` and fix any ESLint warnings across `js/*.js` to satisfy Constitution Principle I's zero-warnings gate
- [ ] T033 [P] Add `package.json` scripts `lint`, `test`, `test:e2e` matching quickstart.md's documented commands
- [ ] T034 Verify `index.html` opened via a `file://` URL shows no console CORS/module-loading errors, and that all four user stories behave identically to the served case (quickstart.md Constraint)
- [ ] T035 [P] Add a test (unit or e2e) simulating `localStorage` unavailable (e.g., private browsing) and confirm quote viewing and "New quote" still work with no visible error, per spec.md Edge Cases
- [ ] T036 Run the full quickstart.md manual validation checklist (US1–US4, storage-unavailable edge case, `file://` constraint) before considering the feature complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion; see User Story Dependencies below for inter-story coupling specific to this single-page app
- **Polish (Phase 7)**: Depends on all four user stories being complete

### User Story Dependencies

Because this feature is a single `index.html` + shared `app.js` (no server, no routing), the stories share state and functions more tightly than a typical multi-service feature:

- **User Story 1 (P1)**: No dependency on other stories. True starting point.
- **User Story 2 (P2)**: Reuses the `render()` function and quote-display elements introduced by US1 — implement after US1.
- **User Story 3 (P2)**: Reuses `render()` from US1; otherwise independent of US2. Can be implemented in parallel with US2 once US1 is done.
- **User Story 4 (P3)**: Depends on `js/favoritesStore.js` and the favorite indicator wiring from US3 — implement after US3.

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle II)
- Pure logic (`quoteSelector.js`, `favoritesStore.js`) before DOM wiring (`app.js`)
- `index.html` elements/script tags before the `app.js` code that targets them

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005)
- T006 and T007 (Foundational) can run in parallel with T009; T008 depends on nothing else in Phase 2 but is typically done alongside T006
- All tests for a user story marked [P] can run in parallel with each other (different files)
- US2 and US3 can be implemented in parallel by different people once US1 is complete, since they touch different script files (`quoteSelector.js` cycling logic vs. `favoritesStore.js`), merging into the same `app.js`/`index.html` only at integration time

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit tests for pickNext(quotes, null) in tests/unit/quoteSelector.test.js"
Task: "Integration test for initial render in tests/integration/app.render.test.js"
Task: "E2E test for US1 (served + file://) in tests/e2e/quote-of-the-day.spec.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Load the page and confirm a quote displays automatically
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Validate independently → Deploy/Demo
4. Add User Story 3 → Validate independently → Deploy/Demo
5. Add User Story 4 → Validate independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done, one developer completes User Story 1 (others are blocked on `render()` until this lands)
3. Once US1 lands:
   - Developer A: User Story 2 (quoteSelector cycling + button)
   - Developer B: User Story 3 (favoritesStore + toggle)
4. Once US3 lands: User Story 4 (favorites view) can proceed
5. Stories integrate into the shared `index.html`/`app.js` at each checkpoint

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Verify tests fail before implementing (Constitution Principle II)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Unlike a typical multi-service feature, US2–US4 here are not fully file-isolated from US1 because all DOM wiring lives in one `app.js` — dependencies above capture that explicitly rather than claiming false independence
