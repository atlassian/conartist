const { config } = require('./config');
const { formatCode, formatJson } = require('./format');
const { array, js, json, string } = require('./handler');
const { getHandlerLocator, setHandlerLocator } = require('./handler-locator');
const { load, raw, resolve } = require('./load');
const { sync } = require('./sync');
const preset = require('./preset');

module.exports = {
  array,
  getHandlerLocator,
  setHandlerLocator,
  config,
  formatCode,
  formatJson,
  js,
  json,
  load,
  preset,
  raw,
  resolve,
  string,
  sync
};
