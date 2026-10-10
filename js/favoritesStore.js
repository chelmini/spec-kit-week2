(function (global) {
  "use strict";

  const STORAGE_KEY = "qotd:favorites";

  let memoryFallback = null;

  function readMemoryFallback() {
    return memoryFallback || [];
  }

  function writeMemoryFallback(ids) {
    memoryFallback = ids;
  }

  function parseStoredValue(raw) {
    if (raw === null || raw === undefined) {
      return [];
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
      return [];
    }
    return parsed;
  }

  function readIds() {
    if (memoryFallback !== null) {
      return readMemoryFallback();
    }
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      return parseStoredValue(raw);
    } catch {
      memoryFallback = [];
      return readMemoryFallback();
    }
  }

  function writeIds(ids) {
    if (memoryFallback !== null) {
      writeMemoryFallback(ids);
      return;
    }
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      memoryFallback = ids;
    }
  }

  function getFavorites() {
    return readIds().slice();
  }

  function isFavorite(id) {
    return readIds().indexOf(id) !== -1;
  }

  function addFavorite(id) {
    const ids = readIds();
    if (ids.indexOf(id) === -1) {
      ids.push(id);
      writeIds(ids);
    }
  }

  function removeFavorite(id) {
    const ids = readIds();
    const index = ids.indexOf(id);
    if (index !== -1) {
      ids.splice(index, 1);
      writeIds(ids);
    }
  }

  const api = { getFavorites, isFavorite, addFavorite, removeFavorite };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.QOTD = global.QOTD || {};
    global.QOTD.favoritesStore = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
