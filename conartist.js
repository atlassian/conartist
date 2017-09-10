const { config } = require('.');
const { base, jest } = require('./preset');

module.exports = config(
  base({
    name: 'Trey Shugart',
    node: 'v8.4.0'
  }),
  jest()
);
