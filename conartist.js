const { merge } = require('lodash');
const { config } = require('.');
const { base, jest } = require('./config');

module.exports = config(base, jest, {
  'package.json': require('./package.json')
});
