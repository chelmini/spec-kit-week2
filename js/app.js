(function (global) {
  "use strict";

  let currentQuote = null;

  function render(quote) {
    currentQuote = quote;
    const textEl = document.getElementById("quote-text");
    const authorEl = document.getElementById("quote-author");
    textEl.textContent = quote.text;
    authorEl.textContent = quote.author;

    const favoriteToggle = document.getElementById("favorite-toggle");
    if (favoriteToggle) {
      const favorited = global.QOTD.favoritesStore.isFavorite(quote.id);
      favoriteToggle.setAttribute("aria-pressed", String(favorited));
    }
  }

  function handleFavoriteToggleClick() {
    if (!currentQuote) return;
    const favoritesStore = global.QOTD.favoritesStore;
    if (favoritesStore.isFavorite(currentQuote.id)) {
      favoritesStore.removeFavorite(currentQuote.id);
    } else {
      favoritesStore.addFavorite(currentQuote.id);
    }
    render(currentQuote);
  }

  function handleRemoveFavoriteClick(id) {
    global.QOTD.favoritesStore.removeFavorite(id);
    renderFavoritesView();
    if (currentQuote && currentQuote.id === id) {
      render(currentQuote);
    }
  }

  function renderFavoritesView() {
    const favoritesStore = global.QOTD.favoritesStore;
    const quotes = global.QOTD.quotes;
    const favoriteIds = favoritesStore.getFavorites();
    const listEl = document.querySelector(".favorites-list");
    const emptyStateEl = document.querySelector(".favorites-empty");

    listEl.innerHTML = "";

    if (favoriteIds.length === 0) {
      emptyStateEl.hidden = false;
      return;
    }
    emptyStateEl.hidden = true;

    favoriteIds.forEach((id) => {
      const quote = quotes.find((q) => q.id === id);
      if (!quote) return;

      const item = document.createElement("li");
      item.className = "favorites-list__item";

      const text = document.createElement("span");
      text.textContent = `${quote.text} — ${quote.author}`;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "is-secondary";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => handleRemoveFavoriteClick(id));

      item.appendChild(text);
      item.appendChild(removeButton);
      listEl.appendChild(item);
    });
  }

  function handleViewFavoritesClick() {
    const favoritesView = document.getElementById("favorites-view");
    const isHidden = favoritesView.hidden;
    favoritesView.hidden = !isHidden;
    if (isHidden) {
      renderFavoritesView();
    }
  }

  function init() {
    const quotes = global.QOTD.quotes;
    const quoteSelector = global.QOTD.quoteSelector;
    const quote = quoteSelector.pickNext(quotes, null);
    render(quote);
  }

  function handleNewQuoteClick() {
    const quotes = global.QOTD.quotes;
    const quoteSelector = global.QOTD.quoteSelector;
    const previousId = currentQuote ? currentQuote.id : null;
    const quote = quoteSelector.pickNext(quotes, previousId);
    render(quote);
  }

  function wireControls() {
    const newQuoteButton = document.getElementById("new-quote-button");
    if (newQuoteButton) {
      newQuoteButton.addEventListener("click", handleNewQuoteClick);
    }

    const favoriteToggle = document.getElementById("favorite-toggle");
    if (favoriteToggle) {
      favoriteToggle.addEventListener("click", handleFavoriteToggleClick);
    }

    const viewFavoritesButton = document.getElementById("view-favorites-button");
    if (viewFavoritesButton) {
      viewFavoritesButton.addEventListener("click", handleViewFavoritesClick);
    }
  }

  const api = {
    init,
    render,
    handleNewQuoteClick,
    handleFavoriteToggleClick,
    renderFavoritesView,
    handleViewFavoritesClick,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.QOTD = global.QOTD || {};
    global.QOTD.app = api;
    document.addEventListener("DOMContentLoaded", function () {
      init();
      wireControls();
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
