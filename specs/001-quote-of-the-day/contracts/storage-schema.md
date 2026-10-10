# Contract: `localStorage` Schema

| Key | Value shape | Written by | Read by |
|---|---|---|---|
| `qotd:favorites` | JSON array of quote `id` strings, e.g. `["q03","q11"]` | `favoritesStore.addFavorite` / `removeFavorite` | `favoritesStore.getFavorites` / `isFavorite` |

Rules (enforced inside `favoritesStore.js`, per `contracts/js-module-contracts.md`):

- This is the **only** key the app writes to `localStorage`. No other keys, no quote data, no UI state.
- A missing key, a value that fails `JSON.parse`, or a parsed value that is not an array of strings MUST all be treated as an empty favorites set — never thrown as an error to the rest of the app.
- Any `localStorage` access that throws (quota exceeded, disabled by browser/privacy setting) MUST be caught at the point of access; the app continues the session using an in-memory fallback with the same shape.
