const { config } = require('./config');
const { js, json, string } = require('./handler');
const { getHandlerLocator, setHandlerLocator } = require('./handler-locator');

module.exports = {
  getHandlerLocator,
  setHandlerLocator,
  config,
  js,
  json,
  string
};
