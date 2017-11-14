module.exports = [
  'babel',
  'base',
  'flow',
  'husky',
  'jest',
  'rollup',
  'typescript',
  'webpack'
].reduce((prev, curr) => {
  prev[curr] = require(`./${curr}`);
  return prev;
}, {});
