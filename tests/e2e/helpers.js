const path = require("node:path");

function indexFileUrl() {
  return `file://${path.resolve(__dirname, "..", "..", "index.html")}`;
}

module.exports = { indexFileUrl };
