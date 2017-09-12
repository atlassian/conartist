const { getHandlerLocator } = require('./handler-locator');
const { merge } = require('lodash');

class Format {
  constructor(file, data, func) {
    this.data = data;
    this.file = file;
    this.func = func;
  }
  process() {
    return this.func(this.data, this.file);
  }
}

function locateHandler(key, val) {
  const handler = getHandlerLocator()(key, val);
  if (handler) return handler;
  throw new Error(`Could not find a handler for "${key}".`);
}

function config(...args) {
  const obj = merge(...args);
  Object.keys(obj)
    .filter(key => obj[key] != null)
    .forEach(key => {
      const val = obj[key];
      obj[key] = new Format(key, val, locateHandler(key, val));
    });
  return obj;
}

module.exports = {
  config
};
