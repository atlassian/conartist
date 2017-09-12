const { config } = require('./config');
const { formatCode, formatJson } = require('./format');
const { js, json, string } = require('./handler');
const { getHandlerLocator, setHandlerLocator } = require('./handler-locator');
const { load, raw, resolve } = require('./load');
const { sync } = require('./sync');

module.exports = {
  getHandlerLocator,
  setHandlerLocator,
  config,
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
