const { mergeWith } = require('lodash');
const deepEqual = require('deep-equal');

function unique(val, idx, arr) {
  return arr.some(cmp => deepEqual(val, cmp));
}

function arrayMerger(val1, val2) {
  if (Array.isArray(val1)) {
    return val1.concat(val2).filter(unique);
  }
}

function merge(object, ...sources) {
  return mergeWith(object, ...sources, arrayMerger);
}

module.exports = { merge };
