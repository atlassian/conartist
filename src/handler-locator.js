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
  if (basename === '.babelrc') return json();
  if (basename === '.eslintrc') return json();

  const extname = path.extname(key);
  if (extname === '.js') return js();
  if (extname === '.json') return json();

  const type = typeof val;
  if (Array.isArray(val)) return array();
  if (type === 'function') return js();
  if (type === 'object') return json();
  if (type === 'string') return string();
});

module.exports = {
  getHandlerLocator,
  setHandlerLocator
};
