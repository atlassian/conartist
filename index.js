const path = require("path");
const prettier = require("prettier");
const cwd = process.cwd();

function js(fn) {
  return file =>
    prettier.format(
      `
    module.exports = require('./${path.relative(
      cwd,
      "handyman.js"
    )}')['${file}']();
  `,
      { parser: "babylon" }
    );
}

function json(fn) {
  return (file, conf) =>
    prettier.format(JSON.stringify(fn()), { parser: "json" });
}

function any(fn) {
  return fn;
}

module.exports = {
  any,
  js,
  json
};
