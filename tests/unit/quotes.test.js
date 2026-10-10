const { quotes } = require("../../js/quotes.js");

describe("quotes data", () => {
  it("has at least 20 entries", () => {
    expect(quotes.length).toBeGreaterThanOrEqual(20);
  });

  it("every entry has a non-empty id, text, and author", () => {
    for (const quote of quotes) {
      expect(typeof quote.id).toBe("string");
      expect(quote.id.length).toBeGreaterThan(0);
      expect(typeof quote.text).toBe("string");
      expect(quote.text.length).toBeGreaterThan(0);
      expect(typeof quote.author).toBe("string");
      expect(quote.author.length).toBeGreaterThan(0);
    }
  });

  it("has unique ids across the list", () => {
    const ids = quotes.map((quote) => quote.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
