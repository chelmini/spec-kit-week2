(function (global) {
  "use strict";

  function pickNext(quotes, previousId) {
    if (!quotes || quotes.length === 0) {
      throw new Error("pickNext requires a non-empty quotes array");
    }

    if (quotes.length === 1) {
      return quotes[0];
    }

    let candidate;
    do {
      const index = Math.floor(Math.random() * quotes.length);
      candidate = quotes[index];
    } while (candidate.id === previousId);

    return candidate;
  }

  const api = { pickNext };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.QOTD = global.QOTD || {};
    global.QOTD.quoteSelector = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
