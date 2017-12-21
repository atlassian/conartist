module.exports = [
  'babel',
  'base',
  'enzyme',
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
