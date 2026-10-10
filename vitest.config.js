module.exports = {
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.js", "tests/integration/**/*.test.js"],
  },
};
