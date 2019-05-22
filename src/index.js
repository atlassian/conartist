const { formatCode, formatJson } = require("./format");
const { array, js, json, string } = require("./handler");
const { getHandlerLocator, setHandlerLocator } = require("./handler-locator");
const { load, raw, resolve } = require("./load");
const { sync } = require("./sync");

module.exports = {
  array,
  getHandlerLocator,
  setHandlerLocator,
  formatCode,
  formatJson,
  js,
  json,
  load,
  raw,
  resolve,
  string,
  sync
};
