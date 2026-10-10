describe("favoritesStore", () => {
  let favoritesStore;

  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    favoritesStore = require("../../js/favoritesStore.js");
  });

  it("returns an empty array when nothing has been favorited", () => {
    expect(favoritesStore.getFavorites()).toEqual([]);
  });

  it("adding a favorite is idempotent", () => {
    favoritesStore.addFavorite("q01");
    favoritesStore.addFavorite("q01");
    expect(favoritesStore.getFavorites()).toEqual(["q01"]);
  });

  it("removing a favorite is idempotent", () => {
    favoritesStore.addFavorite("q01");
    favoritesStore.removeFavorite("q01");
    favoritesStore.removeFavorite("q01");
    expect(favoritesStore.getFavorites()).toEqual([]);
  });

  it("treats a missing localStorage value as an empty set", () => {
    localStorage.removeItem("qotd:favorites");
    expect(favoritesStore.getFavorites()).toEqual([]);
  });

  it("treats a malformed localStorage value as an empty set", () => {
    localStorage.setItem("qotd:favorites", "{not valid json");
    expect(favoritesStore.getFavorites()).toEqual([]);
  });

  it("treats a non-array-of-strings localStorage value as an empty set", () => {
    localStorage.setItem("qotd:favorites", JSON.stringify({ not: "an array" }));
    expect(favoritesStore.getFavorites()).toEqual([]);
  });

  it("persists favorites to localStorage under key qotd:favorites", () => {
    favoritesStore.addFavorite("q02");
    const raw = localStorage.getItem("qotd:favorites");
    expect(JSON.parse(raw)).toEqual(["q02"]);
  });

  it("isFavorite reflects current membership", () => {
    expect(favoritesStore.isFavorite("q03")).toBe(false);
    favoritesStore.addFavorite("q03");
    expect(favoritesStore.isFavorite("q03")).toBe(true);
  });

  it("returns a new array from getFavorites() each call", () => {
    favoritesStore.addFavorite("q04");
    const first = favoritesStore.getFavorites();
    first.push("mutated");
    const second = favoritesStore.getFavorites();
    expect(second).toEqual(["q04"]);
  });

  it("falls back to an in-memory store for the rest of the session when localStorage throws, and never throws to the caller", () => {
    const originalGetItem = Object.getPrototypeOf(localStorage).getItem;
    const originalSetItem = Object.getPrototypeOf(localStorage).setItem;

    Object.getPrototypeOf(localStorage).getItem = () => {
      const error = new Error("SecurityError");
      error.name = "SecurityError";
      throw error;
    };
    Object.getPrototypeOf(localStorage).setItem = () => {
      const error = new Error("SecurityError");
      error.name = "SecurityError";
      throw error;
    };

    try {
      expect(() => favoritesStore.addFavorite("q05")).not.toThrow();
      expect(favoritesStore.getFavorites()).toEqual(["q05"]);
      expect(favoritesStore.isFavorite("q05")).toBe(true);
      expect(() => favoritesStore.removeFavorite("q05")).not.toThrow();
      expect(favoritesStore.getFavorites()).toEqual([]);
    } finally {
      Object.getPrototypeOf(localStorage).getItem = originalGetItem;
      Object.getPrototypeOf(localStorage).setItem = originalSetItem;
    }
  });
});
