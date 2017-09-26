const path = require('path');

const { array, js, json, string } = require('./handler');

let currentHandlerLocator;

function getHandlerLocator() {
  return currentHandlerLocator;
}

function setHandlerLocator(newHandlerLocator) {
  const oldHandlerLocator = currentHandlerLocator;
  currentHandlerLocator = newHandlerLocator;
  return oldHandlerLocator;
}

setHandlerLocator(function(key, val) {
  const basename = path.basename(key);
  const extname = path.extname(key);
  const type = typeof val;

  if (basename === '.babelrc') return json();
  if (basename === '.eslintrc') return json();
  if (extname === '.js' && type === 'object') return js();
  if (Array.isArray(val)) return array();
  if (type === 'function') return js();
  if (type === 'object') return json();
  if (type === 'string') return string();
});

module.exports = {
  getHandlerLocator,
  setHandlerLocator
};
