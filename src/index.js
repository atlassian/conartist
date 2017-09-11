const { config } = require('./config');
const { js, json, string } = require('./handler');
const { getHandlerLocator, setHandlerLocator } = require('./handler-locator');
const { sync } = require('./sync');

module.exports = {
  getHandlerLocator,
  setHandlerLocator,
  config,
  js,
  json,
  string,
  sync
};
