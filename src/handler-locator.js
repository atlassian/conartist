const { js, json, string } = require('./handler');

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
  const type = typeof val;
  if (type === 'function') return js;
  if (type === 'object') return json;
  if (type === 'string') return string;

  const extname = path.extname(key);
  if (extname === '.js') return js;
  if (extname === '.json') return json;

  const basename = path.basename(key);
  if (basename === '.babelrc') return json;
  if (basename === '.eslintrc') return json;
});

module.exports = {
  getHandlerLocator,
  setHandlerLocator
};
