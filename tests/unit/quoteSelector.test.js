const { pickNext } = require("../../js/quoteSelector.js");

const quotes = [
  { id: "a", text: "A", author: "Author A" },
  { id: "b", text: "B", author: "Author B" },
  { id: "c", text: "C", author: "Author C" },
];

describe("pickNext", () => {
  it("returns one of the given quotes when previousId is null", () => {
    const result = pickNext(quotes, null);
    expect(quotes.some((q) => q.id === result.id)).toBe(true);
  });

  it("throws if quotes is empty", () => {
    expect(() => pickNext([], null)).toThrow();
  });

  it("never returns the quote whose id === previousId when quotes.length > 1", () => {
    for (let i = 0; i < 50; i += 1) {
      const result = pickNext(quotes, "a");
      expect(result.id).not.toBe("a");
    }
  });

  it("returns the single available quote when quotes.length === 1, even if its id === previousId", () => {
    const single = [{ id: "only", text: "Only", author: "Author Only" }];
    const result = pickNext(single, "only");
    expect(result.id).toBe("only");
  });
});
