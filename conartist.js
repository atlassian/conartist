const { config } = require('.');
const { base, jest } = require('./preset');

module.exports = config(base(), jest());
