const { test, expect } = require("@playwright/test");
const { indexFileUrl } = require("./helpers.js");

test.describe("User Story 1 - See a quote on arrival", () => {
  test("displays a quote and author automatically when served", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator("#quote-text")).not.toBeEmpty();
    await expect(page.locator("#quote-author")).not.toBeEmpty();
  });

  test("displays a quote and author automatically via file:// URL", async ({ page }) => {
    await page.goto(indexFileUrl());
    await expect(page.locator("#quote-text")).not.toBeEmpty();
    await expect(page.locator("#quote-author")).not.toBeEmpty();

    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    expect(errors).toHaveLength(0);
  });
});

test.describe("User Story 2 - Get a new random quote", () => {
  test("clicking New quote changes the displayed quote and never repeats the immediately-previous one", async ({ page }) => {
    await page.goto("/index.html");

    const textLocator = page.locator("#quote-text");
    const seen = [];

    for (let i = 0; i < 15; i += 1) {
      const current = await textLocator.textContent();
      seen.push(current);
      await page.getByRole("button", { name: "New quote" }).click();
    }

    for (let i = 1; i < seen.length; i += 1) {
      expect(seen[i]).not.toBe(seen[i - 1]);
    }
  });
});

function readFavoriteIds(page) {
  return page.evaluate(() => JSON.parse(window.localStorage.getItem("qotd:favorites") || "[]"));
}

test.describe("User Story 3 - Favorite the current quote", () => {
  test("favoriting updates the indicator immediately and survives a reload; un-favoriting is equally durable", async ({ page }) => {
    await page.goto("/index.html");

    const toggle = page.locator("#favorite-toggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    const favoritedQuoteText = await page.locator("#quote-text").textContent();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    const idsAfterAdd = await readFavoriteIds(page);
    expect(idsAfterAdd).toHaveLength(1);

    // Reload re-rolls the randomly-selected display, so persistence is checked
    // directly against storage and the favorites view rather than by cycling
    // "New quote" hoping to land back on the favorited quote (that was flaky).
    await page.reload();
    await expect.poll(() => readFavoriteIds(page)).toEqual(idsAfterAdd);

    await page.getByRole("button", { name: "View favorites" }).click();
    await expect(page.locator(".favorites-list")).toContainText(favoritedQuoteText);
    await page.getByRole("button", { name: "Remove", exact: false }).first().click();

    expect(await readFavoriteIds(page)).toHaveLength(0);

    await page.reload();
    await expect.poll(() => readFavoriteIds(page)).toHaveLength(0);
  });
});

test.describe("User Story 4 - Browse favorited quotes", () => {
  test("favoriting two or more quotes and opening the favorites view lists all of them; un-favoriting removes items and shows empty state", async ({ page }) => {
    await page.goto("/index.html");

    const favoriteToggle = page.locator("#favorite-toggle");
    const newQuoteButton = page.getByRole("button", { name: "New quote" });

    const favoritedTexts = [];

    await favoriteToggle.click();
    favoritedTexts.push(await page.locator("#quote-text").textContent());

    await newQuoteButton.click();
    await favoriteToggle.click();
    favoritedTexts.push(await page.locator("#quote-text").textContent());

    await page.getByRole("button", { name: "View favorites" }).click();

    const favoritesList = page.locator(".favorites-list");
    await expect(favoritesList).toBeVisible();
    for (const text of favoritedTexts) {
      await expect(favoritesList).toContainText(text);
    }

    await page.getByRole("button", { name: "Remove", exact: false }).first().click();
    await page.reload();
    await page.getByRole("button", { name: "View favorites" }).click();
    await expect(page.locator(".favorites-list__item")).toHaveCount(1);

    await page.getByRole("button", { name: "Remove", exact: false }).first().click();
    await expect(page.locator(".favorites-empty")).toBeVisible();
  });
});

test.describe("Edge case - storage unavailable", () => {
  test("quote viewing and New quote still work with no visible error when localStorage throws", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("SecurityError: localStorage disabled");
        },
      });
    });

    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/index.html");
    await expect(page.locator("#quote-text")).not.toBeEmpty();

    await page.getByRole("button", { name: "New quote" }).click();
    await expect(page.locator("#quote-text")).not.toBeEmpty();

    await page.locator("#favorite-toggle").click();
    await expect(page.locator("#favorite-toggle")).toHaveAttribute("aria-pressed", "true");

    expect(errors).toHaveLength(0);
  });
});
