const { mergeWith } = require('lodash');

function merge(object, ...sources) {
  return mergeWith(object, ...sources, (val1, val2) => {
    if (Array.isArray(val1)) {
      return val1.concat(val2);
    }
  });
}

module.exports = { merge };
