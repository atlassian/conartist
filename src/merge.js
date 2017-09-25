const { mergeWith } = require('lodash');

function unique(val, idx, arr) {
  return arr.indexOf(val) === idx;
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
