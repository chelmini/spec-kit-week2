# Data Model: Quote of the Day

## Quote

A single quotation from the bundled, static list (`js/quotes.js`). Immutable at runtime — never created, edited, or deleted by a visitor.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable identifier, unique within the bundled list (e.g. `"q01"`). Used as the join key for favorites. Never changes once assigned. |
| `text` | string | The quotation itself. Non-empty. |
| `author` | string | Attribution shown alongside `text`. Non-empty (use `"Unknown"` for anonymous quotes rather than leaving blank, so FR-002's "text together with attribution" always holds). |

**Validation rules**: The bundled list MUST contain ≥20 entries (FR-012); every entry MUST have a non-empty `id`, `text`, and `author`; `id` values MUST be unique across the list (duplicate IDs would corrupt favorite-status lookup).

**Relationships**: A Quote may be referenced by zero or one Favorite-set membership (see below). No other entity references Quote.

## Favorite (set membership, not a per-quote record)

Represented as a single durable value: the set of favorited Quote `id`s for this visitor's browser/device. There is no separate "Favorite" object with its own fields — favoriting is a boolean derived from set membership (`isFavorite(id) = id ∈ favoriteIds`).

**Persisted shape** (`localStorage`):

```json
{
  "key": "qotd:favorites",
  "value": ["q03", "q11", "q07"]
}
```

- **Storage key**: `qotd:favorites`
- **Storage value**: JSON-encoded array of Quote `id` strings, order not significant, no duplicates.
- **Scope**: Per browser/device (native `localStorage` scoping — per origin). No cross-device sync, no user accounts, per spec Assumptions.

**Validation rules**:
- Adding a favorite MUST be idempotent (favoriting an already-favorited `id` leaves the set unchanged — addresses the "activated multiple times in quick succession" edge case, FR-005).
- Removing a favorite MUST be idempotent (un-favoriting a not-favorited `id` is a no-op).
- If the stored value is missing, malformed, or `localStorage` throws on read, the effective favorite set MUST be treated as empty rather than causing an error (graceful degradation edge case).

**State transitions**: A Quote `id` has exactly two states with respect to favorites — `favorited` / `not favorited` — toggled only by explicit visitor action (favorite / un-favorite control). No other transitions exist (e.g., no "expiring" favorites).

**In-memory fallback**: When `localStorage` is unavailable, the same shape (array of IDs) is held in a `Map`/array for the lifetime of the page session only; it is intentionally not persisted (per Edge Cases: "favorites simply will not persist" is acceptable degradation).
