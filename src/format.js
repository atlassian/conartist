const prettier = require("prettier");

function formatCode(code) {
  return prettier.format(code, { parser: "babel" });
}

function formatJson(json) {
  return JSON.stringify(json, null, 2);
}

function formatMd(md) {
  return prettier.format(md, { parser: "markdown" });
}

module.exports = {
  formatCode,
  formatJson,
  formatMd
};
