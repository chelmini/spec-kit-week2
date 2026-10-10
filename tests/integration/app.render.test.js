const fs = require("node:fs");
const path = require("node:path");

function loadApp() {
  document.body.innerHTML = fs
    .readFileSync(path.resolve(__dirname, "../../index.html"), "utf8")
    .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, "");

  delete global.window.QOTD;

  global.window.QOTD = global.window.QOTD || {};
  global.window.QOTD.quotes = require("../../js/quotes.js").quotes;
  global.window.QOTD.quoteSelector = require("../../js/quoteSelector.js");
  global.window.QOTD.favoritesStore = require("../../js/favoritesStore.js");
}

describe("app render on load", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = "";
    loadApp();
  });

  it("renders exactly one quote's text and author into the DOM", () => {
    require("../../js/app.js").init();

    const textEl = document.getElementById("quote-text");
    const authorEl = document.getElementById("quote-author");

    expect(textEl.textContent.length).toBeGreaterThan(0);
    expect(authorEl.textContent.length).toBeGreaterThan(0);
  });

  it("reflects favoritesStore.isFavorite(quote.id) as a visible favorited indicator", () => {
    const app = require("../../js/app.js");
    const quotes = global.window.QOTD.quotes;
    const favoritesStore = global.window.QOTD.favoritesStore;

    app.render(quotes[0]);
    const toggle = document.getElementById("favorite-toggle");
    expect(toggle.getAttribute("aria-pressed")).toBe("false");

    favoritesStore.addFavorite(quotes[0].id);
    app.render(quotes[0]);
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
  });

  it("renders every favorited id resolved against quotes with text and author, or an empty-state message", () => {
    const app = require("../../js/app.js");
    const quotes = global.window.QOTD.quotes;
    const favoritesStore = global.window.QOTD.favoritesStore;

    app.renderFavoritesView();
    const emptyState = document.querySelector(".favorites-empty");
    expect(emptyState).not.toBeNull();
    expect(emptyState.hidden).toBe(false);

    favoritesStore.addFavorite(quotes[0].id);
    favoritesStore.addFavorite(quotes[1].id);
    app.renderFavoritesView();

    const items = document.querySelectorAll(".favorites-list__item");
    expect(items.length).toBe(2);
    expect(document.querySelector(".favorites-list").textContent).toContain(quotes[0].text);
    expect(document.querySelector(".favorites-list").textContent).toContain(quotes[1].text);
  });
});
