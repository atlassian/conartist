const { formatCode, formatJson } = require("./format");
const { js, json, string } = require("./handler");
const { getHandlerLocator, setHandlerLocator } = require("./handler-locator");
const { sync } = require("./sync");

module.exports = {
  getHandlerLocator,
  setHandlerLocator,
  formatCode,
  formatJson,
  js,
  json,
  string,
  sync
};
